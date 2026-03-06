import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  getAvailableVoicesAsync,
  getDefaultVoiceIdentifier,
  type VoiceOption,
} from '../services/core.service'
import { getVoice, setVoice } from '../services/voice.service'
import { useAuth } from '../contexts/AuthContext'

export function VoiceSetScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVoices()
  }, [session?.user?.id])

  async function loadVoices() {
    setLoading(true)
    try {
      const available = await getAvailableVoicesAsync()
      setVoices(available)

      const stored = await getVoice(session?.user?.id)
      if (stored) {
        setSelectedId(stored.identifier)
      } else {
        setSelectedId(getDefaultVoiceIdentifier(available))
      }
    } catch {
      setVoices([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSelectVoice(voice: VoiceOption) {
    setSelectedId(voice.identifier)
    try {
      await setVoice({ identifier: voice.identifier, name: voice.name }, session?.user?.id)
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', (err as Error)?.message ?? 'Failed to save voice.')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Set Voice</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>Choose a voice for audio callouts</Text>
          {voices.length === 0 ? (
            <Text style={styles.emptyText}>
              No voices available. Speech will use your device&apos;s default voice. Try opening
              Settings → Accessibility → Text-to-speech to install or enable a voice.
            </Text>
          ) : (
          voices.map((voice) => (
            <TouchableOpacity
              key={voice.identifier}
              style={[styles.voiceRow, selectedId === voice.identifier && styles.voiceRowSelected]}
              onPress={() => handleSelectVoice(voice)}
              activeOpacity={0.7}
            >
              <Text style={styles.voiceName}>{voice.name}</Text>
              {selectedId === voice.identifier && (
                <Ionicons name="checkmark-circle" size={24} color="#5B9A8B" />
              )}
            </TouchableOpacity>
          )))}
        </ScrollView>
      )}
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
  headerBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceRowSelected: {
    borderColor: '#5B9A8B',
    backgroundColor: '#f0f7f5',
  },
  voiceName: { fontSize: 16, color: '#374151', fontWeight: '500' },
  emptyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    paddingVertical: 16,
  },
})
