/**
 * Voice service - persists voice selection to profile (when logged in) and AsyncStorage.
 * Syncs across devices for logged-in users; uses local storage when logged out.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { getProfile, upsertProfile } from './profile.service'
import { VOICE_STORAGE_KEY } from './voice.constants'

export type StoredVoice = { identifier: string; name: string }

function isValidVoice(v: unknown): v is StoredVoice {
  return (
    typeof v === 'object' &&
    v !== null &&
    'identifier' in v &&
    'name' in v &&
    typeof (v as StoredVoice).identifier === 'string' &&
    typeof (v as StoredVoice).name === 'string'
  )
}

/**
 * Get the stored voice. When userId is provided and logged in, reads from profile first;
 * otherwise falls back to AsyncStorage (for logged-out users or offline).
 */
export async function getVoice(userId?: string): Promise<StoredVoice | null> {
  if (userId) {
    try {
      const profile = await getProfile(userId)
      const voice = profile?.general_settings?.voice
      if (isValidVoice(voice)) return voice
    } catch {
      // Fall through to AsyncStorage
    }
  }

  const raw = await AsyncStorage.getItem(VOICE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredVoice
    return isValidVoice(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Save voice selection. Always saves to AsyncStorage (for offline/fallback).
 * When userId is provided, also saves to profile for cross-device sync.
 */
export async function setVoice(
  voice: StoredVoice,
  userId?: string
): Promise<void> {
  await AsyncStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(voice))

  if (userId) {
    try {
      const profile = await getProfile(userId)
      const current = (profile?.general_settings as Record<string, unknown>) ?? {}
      await upsertProfile(userId, {
        general_settings: { ...current, voice },
      })
    } catch (err) {
      console.warn('Failed to save voice to profile:', err)
    }
  }
}
