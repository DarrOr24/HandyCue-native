/**
 * CueCraft settings - intervals and default values for step types.
 */

import type { CueStep, CustomTextStep, TimerStep, RestStep } from './cueCraft.types'

export type CueCraftUserSettings = {
  inputSettings?: {
    getReadyTime?: { min: number; step: number }
    timerDuration?: { min: number; step: number }
    restDuration?: { min: number; step: number }
    repsCount?: { min: number; step: number }
    setsCount?: { min: number; step: number }
    setsRestBetween?: { min: number; step: number }
  }
  defaultValues?: {
    getReadyTime?: number
    timerDuration?: number
    restDuration?: number
    repsCount?: number
    setsCount?: number
    setsRestBetween?: number
  }
}

export function getFeatureInputSettings(
  userSettings: CueCraftUserSettings | null | undefined,
  defaults: { inputSettings: Record<string, unknown>; defaultValues: Record<string, number> }
) {
  return {
    inputSettings: {
      ...defaults.inputSettings,
      ...(userSettings?.inputSettings ?? {}),
    },
    defaultValues: {
      ...defaults.defaultValues,
      ...(userSettings?.defaultValues ?? {}),
    },
  }
}

export const cueCraftDefaults = {
  inputSettings: {
    getReadyTime: { min: 0, step: 1 },
    timerDuration: { min: 5, step: 5 },
    restDuration: { min: 5, step: 5 },
    repsCount: { min: 1, step: 1 },
    setsCount: { min: 1, step: 1 },
    setsRestBetween: { min: 0, step: 5 },
  },
  defaultValues: {
    getReadyTime: 5,
    timerDuration: 30,
    restDuration: 20,
    repsCount: 5,
    setsCount: 1,
    setsRestBetween: 20,
  },
} as const

export const CUE_CRAFT_FIELD_LIMITS = {
  getReadyTime: { minLimit: 0 },
  timerDuration: { minLimit: 1 },
  restDuration: { minLimit: 1 },
  repsCount: { minLimit: 1 },
  setsCount: { minLimit: 1 },
  setsRestBetween: { minLimit: 0 },
}

function genId() {
  return `cue-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Migrate legacy timer/rest steps to customText (Audio Cue with duration). */
export function migrateSteps(steps: CueStep[]): CueStep[] {
  return steps.map((step) => {
    if (step.type === 'timer') {
      const t = step as TimerStep
      return {
        id: step.id,
        type: 'customText' as const,
        text: '',
        duration: t.duration,
        calloutInterval: t.calloutInterval ?? (t.duration <= 24 ? 0 : 10),
        countdownFrom: t.countdownFrom ?? 10,
      } satisfies CustomTextStep
    }
    if (step.type === 'rest') {
      const r = step as RestStep
      return {
        id: step.id,
        type: 'customText' as const,
        text: 'Rest',
        duration: r.duration,
        calloutInterval: 0,
        countdownFrom: 10,
      } satisfies CustomTextStep
    }
    return step
  })
}

export function getDefaultSteps(settings?: CueCraftUserSettings | null): CueStep[] {
  const dv = settings?.defaultValues
  const getReady = dv?.getReadyTime ?? cueCraftDefaults.defaultValues.getReadyTime

  return [
    { id: genId(), type: 'getReady', duration: getReady },
    { id: genId(), type: 'sets', count: 2, restBetween: 60, announceRestCountdown: true },
    { id: genId(), type: 'reps', count: 5 },
    { id: genId(), type: 'customText', text: 'L sit', duration: 15, calloutInterval: 0, countdownFrom: 10 },
    { id: genId(), type: 'customText', text: 'down' },
    { id: genId(), type: 'customText', text: 'Rest', duration: 10 },
  ]
}

export { genId }
