import * as Speech from 'expo-speech'

/**
 * Shared cue coach service - used by HoldOn, EntryBuddy, ShapeJam, DrillDJ.
 * Mirrors structure of HandyCue-frontend services/cueCoach/cueCoach.service.js
 */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function speak(text: string): Promise<void> {
  if (!text) return Promise.resolve()
  return new Promise((resolve) => {
    Speech.speak(text, { onDone: resolve })
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
