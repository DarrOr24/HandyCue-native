/**
 * ShapeJam service - get ready, run shape sets, rest cycle.
 */

import { delay, speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'

export { runGetReadyCountdown, runRestCycle }

export type ShapeItem = { shape: string; holdTime: number }

export async function runShapeSets(options: {
  numSets: number
  numReps: number
  shapes: ShapeItem[]
  restTime: number
  storedVoice: StoredVoice | null
  onDisplay: (content: string) => void
  onRestTick: (elapsed: number, displayContent: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const {
    numSets,
    numReps,
    shapes,
    restTime,
    storedVoice,
    onDisplay,
    onRestTick,
    isCancelled,
  } = options

  for (let set = 1; set <= numSets; set++) {
    if (isCancelled()) return

    const isFinal = set === numSets

    if (numSets === 1) {
      onDisplay('Up!')
      await speak('Handstand up!', storedVoice)
    } else {
      const ordinals = ['st', 'nd', 'rd']
      const suffix = ordinals[set - 1] ?? 'th'
      const label = isFinal ? 'Final Set' : `${set}${suffix} Set`
      onDisplay(label)
      await speak(`${label}: Handstand Up!`, storedVoice)
    }
    if (isCancelled()) return

    await runShapes({
      numReps,
      shapes,
      storedVoice,
      onDisplay,
      isCancelled,
    })
    if (isCancelled()) return

    if (!isFinal) {
      await new Promise<void>((resolve) => {
        runRestCycle({
          restTime,
          storedVoice,
          onTick: (elapsed, display) => onRestTick(elapsed, display),
          onRestComplete: resolve,
          isCancelled,
          onCancelled: resolve,
        })
      })
    }
  }
}

async function runShapes(options: {
  numReps: number
  shapes: ShapeItem[]
  storedVoice: StoredVoice | null
  onDisplay: (content: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const { numReps, shapes, storedVoice, onDisplay, isCancelled } = options

  for (let rep = 1; rep <= numReps; rep++) {
    for (let i = 0; i < shapes.length; i++) {
      if (isCancelled()) return
      const { shape, holdTime } = shapes[i]
      onDisplay(shape)
      await speak(shape, storedVoice)
      if (isCancelled()) return
      await delay(holdTime * 1000)
    }
  }
}
