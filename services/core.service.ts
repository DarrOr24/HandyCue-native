import { Platform } from 'react-native'
import * as Speech from 'expo-speech'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VOICE_STORAGE_KEY } from './voice.constants'

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
  try {
    const voices = await Speech.getAvailableVoicesAsync()
    return voices
      .filter((v) => v.language?.startsWith('en'))
      .map((v) => ({ identifier: v.identifier, name: v.name, language: v.language }))
  } catch {
    return []
  }
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

/**
 * Check if a voice identifier is likely from another platform (e.g. Android voice on iOS).
 * Such voices will fail on the current device, so we skip them and use default.
 */
function isVoiceLikelyUnavailable(voiceOpt: string, platform: string): boolean {
  if (platform === 'ios') {
    return /en-in-x-|network|google/i.test(voiceOpt)
  }
  return false
}

/** iOS uses identifier, Android uses name for voice matching. Always falls back to default voice if the stored one fails. */
export function speak(
  text: string,
  storedVoice?: StoredVoice | null,
  opts?: { rate?: number }
): Promise<void> {
  if (!text) return Promise.resolve()
  return new Promise((resolve) => {
    const baseOptions = { rate: opts?.rate, onDone: resolve }
    let voiceValue: string | undefined = storedVoice
      ? Platform.OS === 'ios'
        ? storedVoice.identifier
        : storedVoice.name
      : undefined
    if (voiceValue != null && isVoiceLikelyUnavailable(voiceValue, Platform.OS)) {
      if (__DEV__) console.warn('[Speech] Voice may be unavailable on this device, using default:', voiceValue)
      voiceValue = undefined
    }

    const doSpeak = (voiceOpt: string | undefined) => {
      const options = { ...baseOptions } as { onDone: () => void; voice?: string; rate?: number; onError?: (e: Error) => void }
      if (voiceOpt != null) options.voice = voiceOpt
      options.onError = (e) => {
        if (voiceOpt != null) {
          if (__DEV__) console.warn('[Speech] Voice failed, retrying with default:', e?.message)
          doSpeak(undefined)
        } else {
          resolve()
        }
      }
      try {
        Speech.speak(text, options)
      } catch (e) {
        if (voiceOpt != null) {
          if (__DEV__) console.warn('[Speech] Voice failed, retrying with default:', (e as Error)?.message)
          doSpeak(undefined)
        } else {
          resolve()
        }
      }
    }
    doSpeak(voiceValue)
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
