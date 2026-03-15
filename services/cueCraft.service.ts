/**
 * CueCraft service - run user-defined sequences.
 */

import { formatTime, speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'
import type { CueStep } from './cueCraft.types'

export { runGetReadyCountdown }

async function runSteps(
  steps: CueStep[],
  storedVoice: StoredVoice | null,
  onDisplay: (content: string) => void,
  isCancelled: () => boolean
): Promise<void> {
  for (let i = 0; i < steps.length; i++) {
    if (isCancelled()) return
    const step = steps[i]

    if (step.type === 'reps') {
      const repSteps = steps.slice(i + 1)
      const nextBlockIndex = repSteps.findIndex((s) => s.type === 'reps' || s.type === 'sets')
      const stepsInRep = nextBlockIndex >= 0 ? repSteps.slice(0, nextBlockIndex) : repSteps
      if (stepsInRep.length === 0) continue

      if (step.announceReps && step.count > 0) {
        await speak(`${step.count} ${step.count === 1 ? 'rep' : 'reps'}`, storedVoice)
        if (isCancelled()) return
      }
      for (let rep = 1; rep <= step.count; rep++) {
        if (isCancelled()) return
        await runSteps(stepsInRep, storedVoice, onDisplay, isCancelled)
        if (isCancelled()) return
      }
      i += stepsInRep.length
      continue
    }

    if (step.type === 'sets') {
      const setSteps = steps.slice(i + 1)
      const nextSetsIndex = setSteps.findIndex((s) => s.type === 'sets')
      const stepsInSet = nextSetsIndex >= 0 ? setSteps.slice(0, nextSetsIndex) : setSteps
      if (stepsInSet.length === 0) continue

      for (let set = 1; set <= step.count; set++) {
        if (isCancelled()) return
        if (step.count > 1) {
          await speak(`Set ${set} of ${step.count}`, storedVoice)
          if (isCancelled()) return
        }
        await runSteps(stepsInSet, storedVoice, onDisplay, isCancelled)
        if (isCancelled()) return
        if (set < step.count && step.restBetween > 0) {
          onDisplay('Rest')
          await speak(`Rest for ${step.restBetween} seconds`, storedVoice)
          if (isCancelled()) return
          await new Promise<void>((resolve) => {
            runRestCycle({
              restTime: step.restBetween,
              storedVoice,
              onTick: (_, display) => onDisplay(display),
              onRestComplete: resolve,
              isCancelled,
              onCancelled: resolve,
              announceCountdown: step.announceRestCountdown ?? true,
            })
          })
        }
      }
      i += stepsInSet.length
      continue
    }

    switch (step.type) {
      case 'getReady':
        await runGetReadyCountdown({
          getReadyTime: step.duration,
          storedVoice,
          onTick: onDisplay,
          isCancelled,
        })
        break

      case 'timer': {
        const countdownFrom = Math.min(step.countdownFrom ?? 10, step.duration)
        const calloutInterval = step.calloutInterval ?? (step.duration <= 24 ? 0 : 10)
        const useCallouts = step.duration > countdownFrom
        const initialDisplay =
          step.duration <= countdownFrom ? String(step.duration) : '0:00'
        onDisplay(initialDisplay)
        if (isCancelled()) return
        await new Promise<void>((resolve) => {
          const startTime = Date.now()
          let lastElapsed = -1
          const interval = setInterval(() => {
            if (isCancelled()) {
              clearInterval(interval)
              resolve()
              return
            }
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            if (elapsed === lastElapsed) return
            lastElapsed = elapsed
            const remaining = step.duration - elapsed
            const display =
              remaining <= countdownFrom && remaining > 0
                ? String(remaining)
                : formatTime(elapsed)
            onDisplay(display)
            if (remaining <= countdownFrom && remaining > 0) {
              speak(String(remaining), storedVoice)
            } else if (
              useCallouts &&
              calloutInterval > 0 &&
              elapsed > 0 &&
              elapsed % calloutInterval === 0 &&
              remaining > countdownFrom
            ) {
              speak(String(elapsed), storedVoice)
            }
            if (elapsed >= step.duration) {
              clearInterval(interval)
              resolve()
            }
          }, 100)
        })
        break
      }

      case 'rest':
        onDisplay('Rest')
        await speak(`Rest for ${step.duration} seconds`, storedVoice)
        if (isCancelled()) return
        await new Promise<void>((resolve) => {
          runRestCycle({
            restTime: step.duration,
            storedVoice,
            onTick: (_, display) => onDisplay(display),
            onRestComplete: resolve,
            isCancelled,
            onCancelled: resolve,
            announceCountdown: step.announceCountdown ?? true,
          })
        })
        break

      case 'customText':
        onDisplay(step.text || '...')
        if (step.text?.trim()) {
          await speak(step.text.trim(), storedVoice)
        }
        break
    }
  }
}

export async function runCueSequence(options: {
  steps: CueStep[]
  storedVoice: StoredVoice | null
  onDisplay: (content: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const { steps, storedVoice, onDisplay, isCancelled } = options
  await runSteps(steps, storedVoice, onDisplay, isCancelled)
}
