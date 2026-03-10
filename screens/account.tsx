import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ProfileAvatar } from '../components/avatar/profile-avatar'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile, type Profile } from '../services/profile.service'
import { supabase } from '../lib/supabase'
import { validatePassword } from '../lib/password-validation'

export function AccountScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      getProfile(session.user.id)
        .then((p) => {
          setProfile(p)
          if (p) {
            setFullName(p.full_name ?? '')
          }
        })
        .catch(() => setProfile(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [session?.user?.id])

  async function handleSave() {
    if (!session?.user?.id) return
    setSaving(true)
    try {
      await upsertProfile(session.user.id, {
        full_name: fullName.trim() || null,
      })
      Alert.alert('Saved', 'Your account has been updated.')
      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'Are you sure? This cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Supabase requires an Edge Function for user self-deletion (calls admin.deleteUser).
              // Until that's set up, we sign the user out.
              await supabase.auth.signOut()
              navigation.navigate('Home')
              Alert.alert(
                'Account deletion',
                'Full account deletion requires backend setup. You have been signed out. To permanently delete your account, use Supabase Dashboard → Authentication → Users.',
              )
            } catch (err: any) {
              Alert.alert('Error', err.message ?? 'Failed to sign out')
            }
          },
        },
      ]
    )
  }

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password')
      return
    }
    const pwCheck = validatePassword(newPassword)
    if (!pwCheck.valid) {
      Alert.alert('Error', pwCheck.message)
      return
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    setUpdatingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      Alert.alert('Success', 'Your password has been updated.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to update password')
    } finally {
      setUpdatingPassword(false)
    }
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Account</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.placeholder}>Log in to manage your account.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={styles.saveBtn}
          hitSlop={12}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#5B9A8B" />
          ) : (
            <Ionicons name="save-outline" size={22} color="#5B9A8B" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <ProfileAvatar size="xl" isUpdatable />
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.sectionTitle}>Change password</Text>
        <View style={styles.field}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.inputPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowNewPassword((p) => !p)}
              hitSlop={12}
            >
              <Ionicons
                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Confirm new password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.inputPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirmPassword((p) => !p)}
              hitSlop={12}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.changePasswordBtn, updatingPassword && styles.btnDisabled]}
          onPress={handleChangePassword}
          disabled={updatingPassword}
        >
          {updatingPassword ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.changePasswordBtnText}>Update password</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Billing</Text>
        <TouchableOpacity
          style={styles.billingRow}
          onPress={() => navigation.navigate('Billing')}
          activeOpacity={0.7}
        >
          <Ionicons name="card-outline" size={22} color="#5B9A8B" />
          <Text style={styles.billingRowText}>Plan</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteBtnText}>Delete my account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  saveBtn: { padding: 4, minWidth: 32, alignItems: 'flex-end' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  placeholder: { fontSize: 16, color: '#666' },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarHint: { fontSize: 12, color: '#9ca3af', marginTop: 8 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
    marginBottom: 12,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#f9fafb',
  },
  inputPassword: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeBtn: { padding: 14 },
  changePasswordBtn: {
    backgroundColor: '#5B9A8B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  changePasswordBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnDisabled: { opacity: 0.7 },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  billingRowText: { flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' },
  deleteBtn: {
    borderWidth: 1,
    borderColor: '#dc2626',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtnText: { color: '#dc2626', fontSize: 16, fontWeight: '600' },
})
