/**
 * CueCraft service - run user-defined sequences.
 */

import { formatTime, speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'
import type { CueStep } from './cueCraft.types'
import { migrateSteps } from './cueCraft.settings.service'

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

      case 'customText': {
        const duration = step.duration ?? 0
        const text = step.text?.trim()
        const displayText = text || (duration > 0 ? 'Hold' : '...')
        onDisplay(displayText)
        const toSpeak = text
          ? text
          : duration > 0
            ? `Hold for ${duration} seconds`
            : null
        if (toSpeak) {
          await speak(toSpeak, storedVoice)
        }
        if (duration > 0) {
          if (isCancelled()) return
          const countdownFrom = Math.min(step.countdownFrom ?? 10, duration)
          const calloutInterval = step.calloutInterval ?? (duration <= 24 ? 0 : 10)
          const useCallouts = duration > countdownFrom
          onDisplay(duration <= countdownFrom ? String(duration) : '0:00')
          // Wall-clock timer: resolves when elapsed >= duration, so the final second after “1” is included
          // (same idea as HoldOn rest/hold — not a discrete loop missing a trailing delay).
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
              const remaining = duration - elapsed
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
              if (elapsed >= duration) {
                clearInterval(interval)
                resolve()
              }
            }, 100)
          })
        }
        break
      }

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
  const migrated = migrateSteps(steps)

  const setsStep = migrated.find((s) => s.type === 'sets')
  if (setsStep) {
    const innerSteps = migrated.filter((s) => s.type !== 'sets')
    for (let set = 1; set <= setsStep.count; set++) {
      if (isCancelled()) return
      if (setsStep.count > 1) {
        await speak(`Set ${set} of ${setsStep.count}`, storedVoice)
        if (isCancelled()) return
      }
      await runSteps(innerSteps, storedVoice, onDisplay, isCancelled)
      if (isCancelled()) return
      if (set < setsStep.count && setsStep.restBetween > 0) {
        onDisplay('Rest')
        await speak(`Rest for ${setsStep.restBetween} seconds`, storedVoice)
        if (isCancelled()) return
        await new Promise<void>((resolve) => {
          runRestCycle({
            restTime: setsStep.restBetween,
            storedVoice,
            onTick: (_, display) => onDisplay(display),
            onRestComplete: resolve,
            isCancelled,
            onCancelled: resolve,
            announceCountdown: setsStep.announceRestCountdown ?? true,
          })
        })
      }
    }
  } else {
    await runSteps(migrated, storedVoice, onDisplay, isCancelled)
  }
}
