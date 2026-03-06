/**
 * DrillDJ service - perform phases with optional voice count.
 */

import { delay, speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'

export { runGetReadyCountdown, runRestCycle }

const COUNT_VOICE_OPTIONS = { rate: 1.3 }

export async function performPhase(options: {
  label: string
  displayLabel: string
  duration: number
  setDisplayStep: (s: string) => void
  voice: StoredVoice | null
  enableMetronome: boolean
  onPhaseStart?: () => void
  onPhaseEnd?: () => void
  isCancelled: () => boolean
}): Promise<void> {
  const {
    label,
    displayLabel,
    duration,
    setDisplayStep,
    voice,
    enableMetronome,
    onPhaseStart,
    onPhaseEnd,
    isCancelled,
  } = options

  if (label === 'Hold' && duration === 0) return

  setDisplayStep(displayLabel)
  const announceLabel = duration > 10 ? `${label} for ${duration} seconds` : label
  await speak(announceLabel, voice)
  if (isCancelled()) return

  if (duration < 5 || !enableMetronome) {
    await delay(duration * 1000)
    return
  }

  onPhaseStart?.()
  const COUNT_INTERVAL_MS = 1000
  const ordinals: Record<number, string> = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
  }

  const halfwayPoint = duration >= 30 ? Math.floor(duration / 2) : -1

  for (let i = 0; i < duration; i++) {
    if (isCancelled()) break

    let countWord: string | null = null
    if (duration <= 10) {
      const countValue = duration - i
      countWord = ordinals[countValue] ?? String(countValue)
    } else {
      const secondsLeft = duration - i
      if (i === halfwayPoint) {
        countWord = 'halfway'
      } else if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = ordinals[secondsLeft] ?? String(secondsLeft)
      }
    }

    if (countWord) {
      speak(countWord, voice, COUNT_VOICE_OPTIONS)
    }
    if (isCancelled()) break
    if (i < duration - 1) {
      await delay(COUNT_INTERVAL_MS)
    }
  }
  onPhaseEnd?.()
}
