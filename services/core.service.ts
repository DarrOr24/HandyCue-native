import { Platform } from 'react-native'
import * as Speech from 'expo-speech'
import AsyncStorage from '@react-native-async-storage/async-storage'

const VOICE_STORAGE_KEY = '@handycue/voice'

/**
 * Core shared service - voice, speech, timing utilities.
 * Used by HoldOn, voice settings, and future features.
 */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export interface VoiceOption {
  identifier: string
  name: string
  language: string
}

export async function getAvailableVoicesAsync(): Promise<VoiceOption[]> {
  const voices = await Speech.getAvailableVoicesAsync()
  return voices
    .filter((v) => v.language?.startsWith('en'))
    .map((v) => ({ identifier: v.identifier, name: v.name, language: v.language }))
}

export function getDefaultVoiceIdentifier(voices: VoiceOption[]): string {
  if (!voices.length) return ''
  const preferred = voices.find((v) => /Samantha|Karen|Daniel|Moira|Google/i.test(v.name))
  return preferred?.identifier ?? voices[0].identifier
}

export interface StoredVoice {
  identifier: string
  name: string
}

export async function getStoredVoice(): Promise<StoredVoice | null> {
  const raw = await AsyncStorage.getItem(VOICE_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredVoice
  } catch {
    return null
  }
}

export { VOICE_STORAGE_KEY }

/** iOS uses identifier, Android uses name for voice matching. */
export function speak(text: string, storedVoice?: StoredVoice | null): Promise<void> {
  if (!text) return Promise.resolve()
  return new Promise((resolve) => {
    const options: { onDone: () => void; voice?: string } = { onDone: resolve }
    if (storedVoice) {
      options.voice = Platform.OS === 'ios' ? storedVoice.identifier : storedVoice.name
    }
    Speech.speak(text, options)
  })
}

export function stopSpeech(): void {
  Speech.stop()
}

/**
 * Creates a reset/cancel signal for async operations.
 * When reset is pressed, call signal() - any running operation should check isCancelled() and bail.
 */
export function createResetSignal() {
  let cancelled = false
  return {
    signal: () => {
      cancelled = true
    },
    reset: () => {
      cancelled = false
    },
    isCancelled: () => cancelled,
  }
}
