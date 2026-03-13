/**
 * DrillDJ service - perform phases with optional voice count.
 */

import { delay, formatTime, speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'

export { runGetReadyCountdown, runRestCycle }

export async function performPhase(options: {
  label: string
  displayLabel: string
  duration: number
  setDisplayStep: (s: string) => void
  voice: StoredVoice | null
  enableMetronome: boolean
  onPhaseStart?: () => void
  onPhaseEnd?: () => void
  onTick?: (elapsed: number, display: string) => void
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
    onTick,
    isCancelled,
  } = options

  if (label === 'Hold' && duration === 0) return

  setDisplayStep(displayLabel)
  const announceLabel = duration >= 10 ? `${label} for ${duration}` : label
  await speak(announceLabel, voice)
  if (isCancelled()) return

  if (duration < 5 || !enableMetronome) {
    await delay(duration * 1000)
    return
  }

  onPhaseStart?.()
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
      // HoldOn-style: say elapsed every 10s when remaining > 10, then countdown from 10
      if (secondsLeft > 10 && i > 0 && i % 10 === 0) {
        countWord = String(i)
      } else if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = String(secondsLeft)
      }
    } else if (duration >= 12) {
      // 12–24 seconds: countdown from 10 only
      if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = String(secondsLeft)
      }
    } else {
      // 5–11 seconds: countdown when remaining <= 10 (or from duration if smaller)
      if (secondsLeft <= 10 && secondsLeft >= 1) {
        countWord = String(secondsLeft)
      }
    }

    if (countWord) {
      speak(countWord, voice)
    }
    if (isCancelled()) break
    if (i < duration - 1) {
      await delay(COUNT_INTERVAL_MS)
    }
  }
  onPhaseEnd?.()
}

export type CalloutConfig = {
  type: 'none' | 'switch' | 'both'
  afterReps?: number
  nested?: {
    type: 'none' | 'switch' | 'both'
    afterReps?: number
  }
}

export async function runCallout(
  callout: CalloutConfig,
  runRepsFn: (repCount: number) => Promise<void>,
  setDisplayStep: (s: string) => void,
  voice: StoredVoice | null,
  isCancelled: () => boolean
): Promise<void> {
  const { type, afterReps = 0, nested = {} } = callout
  if (type === 'none') return

  if (type === 'switch') {
    setDisplayStep('Switch')
    await speak('Switch legs', voice)
    if (isCancelled()) return
    await runRepsFn(afterReps)
    if (isCancelled()) return
    if (nested.type === 'both') {
      setDisplayStep('Both')
      await speak('Both legs', voice)
      if (isCancelled()) return
      await runRepsFn(nested.afterReps ?? 0)
    }
  }

  if (type === 'both') {
    setDisplayStep('Both')
    await speak('Both legs', voice)
    if (isCancelled()) return
    await runRepsFn(afterReps)
    if (isCancelled()) return
    if (nested.type === 'switch') {
      setDisplayStep('Switch')
      await speak('Switch legs', voice)
      if (isCancelled()) return
      await runRepsFn(nested.afterReps ?? 0)
    }
  }
}
