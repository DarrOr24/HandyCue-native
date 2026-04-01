/**
 * Drill DJ–style timed interval: optional spoken countdown and display ticks.
 * Shared by Drill DJ (performPhase) and Shape Jam shape intervals.
 *
 * Countdown numbers are spoken without awaiting — wall-clock progress follows the 1s delays in the loop.
 * After the last spoken count (e.g. “1”), we still await one final 1s delay so that last second completes
 * before the function returns. Callers may add a short gap before the next cue if needed.
 */

import { delay, formatTime, speak, type StoredVoice } from './core.service'

export async function runDrillDjStyleInterval(options: {
  duration: number
  voice: StoredVoice | null
  enableVoiceCount: boolean
  onTick?: (elapsed: number, display: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const { duration, voice, enableVoiceCount, onTick, isCancelled } = options

  if (duration < 5 || !enableVoiceCount) {
    await delay(duration * 1000)
    return
  }

  const COUNT_INTERVAL_MS = 1000

  for (let i = 0; i < duration; i++) {
    const secondsLeft = duration - i
    if (onTick) {
      if (duration >= 25) {
        onTick(i, secondsLeft <= 10 ? String(secondsLeft) : formatTime(i))
      } else if (secondsLeft <= 10 && secondsLeft >= 1) {
        onTick(i, String(secondsLeft))
      }
    }
    if (isCancelled()) break

    let countWord: string | null = null

    if (duration >= 25) {
      if (secondsLeft > 10 && i > 0 && i % 10 === 0) {
        countWord = String(i)
      } else if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = String(secondsLeft)
      }
    } else if (duration >= 12) {
      if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = String(secondsLeft)
      }
    } else {
      if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = String(secondsLeft)
      }
    }

    // Do not await speech: cadence follows the 1s delays below, not TTS length.
    if (countWord) {
      speak(countWord, voice)
    }
    if (isCancelled()) break
    await delay(COUNT_INTERVAL_MS)
  }
}
