import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { getAuthRedirectUrl } from '../lib/auth-deeplink'

export function LoginScreen() {
  const navigation = useNavigation<any>()
  const devEmail = process.env.EXPO_PUBLIC_DEV_EMAIL ?? ''
  const devPassword = process.env.EXPO_PUBLIC_DEV_PASSWORD ?? ''
  const hasDevCredentials = __DEV__ && !!devEmail && !!devPassword

  const [email, setEmail] = useState(devEmail)
  const [password, setPassword] = useState(devPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: getAuthRedirectUrl() },
      })
      if (error) throw error
      Alert.alert('Success', 'Check your email to confirm your account.')
      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Enter your email', 'Type your email above, then tap Forgot password to receive a reset link.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getAuthRedirectUrl(),
      })
      if (error) throw error
      Alert.alert(
        'Check your email',
        'We sent you a link to reset your password. Open it on this device to set a new password.',
      )
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  /** Magic link: no password, no email confirmation. Works in simulator. */
  async function handleMagicLink() {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: getAuthRedirectUrl(),
        },
      })
      if (error) throw error
      Alert.alert('Check your email', 'We sent you a sign-in link. Open it on this device to log in.')
      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to send link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Log in</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.inputPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={12}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotLink}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotLinkText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Log in</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.btnSecondaryText}>Create account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnMagic]}
              onPress={handleMagicLink}
              disabled={loading}
            >
              <Text style={styles.btnMagicText}>Email me a sign-in link</Text>
            </TouchableOpacity>

            {hasDevCredentials && (
              <TouchableOpacity
                style={[styles.btn, styles.btnDev]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <Text style={styles.btnDevText}>Dev login (no email sent)</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboard: { flex: 1 },
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
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeBtn: {
    padding: 14,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotLinkText: {
    fontSize: 14,
    color: '#5B9A8B',
    fontWeight: '500',
  },
  btn: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimary: { backgroundColor: '#5B9A8B' },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSecondary: { backgroundColor: '#f3f4f6' },
  btnSecondaryText: { color: '#374151', fontSize: 16 },
  btnMagic: { backgroundColor: 'transparent', marginTop: 8 },
  btnMagicText: { color: '#5B9A8B', fontSize: 14 },
  btnDev: { backgroundColor: '#e0e7ff', marginTop: 16 },
  btnDevText: { color: '#4338ca', fontSize: 14, fontWeight: '600' },
})
