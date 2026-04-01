/**
 * DrillDJ service - perform phases with optional voice count.
 */

import { speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'
import { runDrillDjStyleInterval } from './voiceCountInterval.service'

export { runGetReadyCountdown, runRestCycle }
export { runDrillDjStyleInterval } from './voiceCountInterval.service'

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

  const willCount = duration >= 5 && enableMetronome
  if (willCount) onPhaseStart?.()
  await runDrillDjStyleInterval({
    duration,
    voice,
    enableVoiceCount: enableMetronome,
    onTick,
    isCancelled,
  })
  if (willCount) onPhaseEnd?.()
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
  isCancelled: () => boolean,
  sayRepCount: boolean
): Promise<void> {
  const { type, afterReps = 0, nested = {} } = callout
  if (type === 'none') return

  const sayReps = (count: number) =>
    sayRepCount && count > 0
      ? speak(`${count} ${count === 1 ? 'rep' : 'reps'}`, voice)
      : Promise.resolve()

  if (type === 'switch') {
    setDisplayStep('Switch')
    await speak('Switch legs', voice)
    if (isCancelled()) return
    if (sayRepCount) {
      await sayReps(afterReps)
      if (isCancelled()) return
    }
    await runRepsFn(afterReps)
    if (isCancelled()) return
    if (nested.type === 'both') {
      setDisplayStep('Both')
      await speak('Both legs', voice)
      if (isCancelled()) return
      if (sayRepCount) {
        await sayReps(nested.afterReps ?? 0)
        if (isCancelled()) return
      }
      await runRepsFn(nested.afterReps ?? 0)
    }
  }

  if (type === 'both') {
    setDisplayStep('Both')
    await speak('Both legs', voice)
    if (isCancelled()) return
    if (sayRepCount) {
      await sayReps(afterReps)
      if (isCancelled()) return
    }
    await runRepsFn(afterReps)
    if (isCancelled()) return
    if (nested.type === 'switch') {
      setDisplayStep('Switch')
      await speak('Switch legs', voice)
      if (isCancelled()) return
      if (sayRepCount) {
        await sayReps(nested.afterReps ?? 0)
        if (isCancelled()) return
      }
      await runRepsFn(nested.afterReps ?? 0)
    }
  }
}
