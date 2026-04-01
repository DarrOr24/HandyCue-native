/**
 * ShapeJam service - get ready, run shape sets, rest cycle.
 */

import { delay, speak, type StoredVoice } from './core.service'
import { runGetReadyCountdown, runRestCycle } from './holdOn.service'
import { runDrillDjStyleInterval } from './voiceCountInterval.service'

export { runGetReadyCountdown, runRestCycle }

export type ShapeItem = { shape: string; holdTime: number }

/** True when every row uses the same hold time (required for shuffle mode). */
export function shapeJamIntervalsAllSame(shapes: ShapeItem[]): boolean {
  if (shapes.length <= 1) return true
  const t0 = shapes[0]?.holdTime
  return shapes.every((s) => s.holdTime === t0)
}

/** Shape Jam only, when Voice count is on: brief pause after the shape cue before the countdown starts. */
const SHAPE_VOICE_COUNT_GAP_MS = 700

function pickRandomShapeAvoidingRepeat(
  shapes: ShapeItem[],
  previousShapeName: string | null
): ShapeItem {
  const pool =
    previousShapeName == null
      ? shapes
      : shapes.filter((s) => s.shape !== previousShapeName)
  if (pool.length === 0) {
    return shapes[Math.floor(Math.random() * shapes.length)]
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function runShapeSets(options: {
  numSets: number
  numReps: number
  shapes: ShapeItem[]
  restTime: number
  storedVoice: StoredVoice | null
  voiceCountEnabled: boolean
  shuffleEnabled?: boolean
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
    voiceCountEnabled,
    shuffleEnabled = false,
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
      voiceCountEnabled,
      shuffleEnabled,
      onDisplay,
      isCancelled,
    })
    if (isCancelled()) return

    if (!isFinal) {
      onDisplay('Rest')
      await speak(`Set finished. Rest for ${restTime} seconds`, storedVoice)
      if (isCancelled()) return
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
  voiceCountEnabled: boolean
  shuffleEnabled: boolean
  onDisplay: (content: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const {
    numReps,
    shapes,
    storedVoice,
    voiceCountEnabled,
    shuffleEnabled,
    onDisplay,
    isCancelled,
  } = options

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  if (shuffleEnabled) {
    let previousShapeName: string | null = null
    for (let rep = 1; rep <= numReps; rep++) {
      for (let i = 0; i < shapes.length; i++) {
        if (isCancelled()) return
        const { shape, holdTime } = pickRandomShapeAvoidingRepeat(shapes, previousShapeName)
        previousShapeName = shape
        const displayShape = capitalize(shape)
        onDisplay(displayShape)
        await speak(displayShape, storedVoice)
        if (isCancelled()) return
        if (voiceCountEnabled) {
          await delay(SHAPE_VOICE_COUNT_GAP_MS)
          if (isCancelled()) return
        }
        await runDrillDjStyleInterval({
          duration: holdTime,
          voice: storedVoice,
          enableVoiceCount: voiceCountEnabled,
          onTick:
            holdTime >= 5 && voiceCountEnabled
              ? (_, display) => onDisplay(display)
              : undefined,
          isCancelled,
        })
        if (isCancelled()) return
      }
    }
    return
  }

  for (let rep = 1; rep <= numReps; rep++) {
    for (let i = 0; i < shapes.length; i++) {
      if (isCancelled()) return
      const { shape, holdTime } = shapes[i]
      const displayShape = capitalize(shape)
      onDisplay(displayShape)
      await speak(displayShape, storedVoice)
      if (isCancelled()) return
      if (voiceCountEnabled) {
        await delay(SHAPE_VOICE_COUNT_GAP_MS)
        if (isCancelled()) return
      }
      await runDrillDjStyleInterval({
        duration: holdTime,
        voice: storedVoice,
        enableVoiceCount: voiceCountEnabled,
        onTick:
          holdTime >= 5 && voiceCountEnabled
            ? (_, display) => onDisplay(display)
            : undefined,
        isCancelled,
      })
      if (isCancelled()) return
    }
  }
}
