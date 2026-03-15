/**
 * CueCraft settings - defaults for new sequences.
 */

import type { CueStep } from './cueCraft.types'

export type CueCraftUserSettings = {
  defaultValues?: {
    steps?: CueStep[]
  }
}

function genId() {
  return `cue-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getDefaultSteps(): CueStep[] {
  return [
    { id: genId(), type: 'getReady', duration: 5 },
    { id: genId(), type: 'sets', count: 1, restBetween: 20 },
    { id: genId(), type: 'reps', count: 5 },
    { id: genId(), type: 'customText', text: 'Handstand up!' },
    { id: genId(), type: 'timer', duration: 30 },
  ]
}

export { genId }
