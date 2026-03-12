/**
 * Sets iOS audio mode so voice/speech plays when device is in silent mode.
 * Must run early so expo-speech and expo-audio work on iPhone with mute switch on.
 */
import { setAudioModeAsync } from 'expo-audio'
import { useEffect } from 'react'

export function AudioModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
    }).catch(() => {
      // ignore - may fail on web or unsupported platforms
    })
  }, [])

  return <>{children}</>
}
