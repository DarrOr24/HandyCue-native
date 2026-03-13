/**
 * Sets audio mode so voice/speech and tick sounds play correctly.
 * - iOS: plays when device is in silent mode (mute switch on)
 * - Android: routes to speaker (not earpiece), requests audio focus for reliable playback
 */
import { Platform } from 'react-native'
import { setAudioModeAsync } from 'expo-audio'
import { useEffect } from 'react'

export function AudioModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      // Android: ensure audio goes to speaker, not earpiece (fixes no-sound on some devices)
      ...(Platform.OS === 'android' && { shouldRouteThroughEarpiece: false }),
    }).catch(() => {
      // ignore - may fail on web or unsupported platforms
    })
  }, [])

  return <>{children}</>
}
