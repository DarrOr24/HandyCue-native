/**
 * CueCraft settings - intervals and default values for step types.
 */

import type { CueStep, CustomTextStep, TimerStep, RestStep } from './cueCraft.types'

export type CueCraftUserSettings = {
  inputSettings?: {
    getReadyTime?: { min: number; step: number }
    duration?: { min: number; step: number }
    repsCount?: { min: number; step: number }
    setsCount?: { min: number; step: number }
    setsRestBetween?: { min: number; step: number }
  }
  defaultValues?: {
    getReadyTime?: number
    duration?: number
    repsCount?: number
    setsCount?: number
    setsRestBetween?: number
  }
}

export function getFeatureInputSettings(
  userSettings: CueCraftUserSettings | null | undefined,
  defaults: { inputSettings: Record<string, unknown>; defaultValues: Record<string, number> }
) {
  const ui = (userSettings?.inputSettings ?? {}) as Record<string, unknown>
  const uv = (userSettings?.defaultValues ?? {}) as Record<string, unknown>
  // Backward compat: map legacy timerDuration -> duration
  const inputSettings = {
    ...defaults.inputSettings,
    ...ui,
    ...(ui.timerDuration != null && ui.duration == null ? { duration: ui.timerDuration } : {}),
  }
  const defaultValues = {
    ...defaults.defaultValues,
    ...uv,
    ...(uv.timerDuration != null && uv.duration == null ? { duration: uv.timerDuration } : {}),
  }
  return { inputSettings, defaultValues }
}

export const cueCraftDefaults = {
  inputSettings: {
    getReadyTime: { min: 0, step: 1 },
    duration: { min: 0, step: 1 },
    repsCount: { min: 1, step: 1 },
    setsCount: { min: 1, step: 1 },
    setsRestBetween: { min: 0, step: 5 },
  },
  defaultValues: {
    getReadyTime: 5,
    duration: 5,
    repsCount: 5,
    setsCount: 1,
    setsRestBetween: 20,
  },
} as const

export const CUE_CRAFT_FIELD_LIMITS = {
  getReadyTime: { minLimit: 0 },
  duration: { minLimit: 0 },
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
      const dur = t.duration
      return {
        id: step.id,
        type: 'customText' as const,
        text: '',
        duration: dur,
        calloutInterval: t.calloutInterval ?? (dur <= 24 ? 0 : 10),
        countdownFrom: Math.min(t.countdownFrom ?? 10, dur),
      } satisfies CustomTextStep
    }
    if (step.type === 'rest') {
      const r = step as RestStep
      const dur = r.duration
      return {
        id: step.id,
        type: 'customText' as const,
        text: 'Rest',
        duration: dur,
        calloutInterval: 0,
        countdownFrom: Math.min(10, dur),
      } satisfies CustomTextStep
    }
    return step
  })
}

export function getDefaultSteps(settings?: CueCraftUserSettings | null): CueStep[] {
  const dv = settings?.defaultValues
  const getReady = dv?.getReadyTime ?? cueCraftDefaults.defaultValues.getReadyTime

  return [
    { id: genId(), type: 'getReady', duration: 2 },
    { id: genId(), type: 'sets', count: 2, restBetween: 60, announceRestCountdown: true },
    { id: genId(), type: 'reps', count: 5, announceReps: false },
    { id: genId(), type: 'customText', text: 'L sit', duration: 15, calloutInterval: 0, countdownFrom: 10 },
    { id: genId(), type: 'customText', text: 'Down', duration: 10, calloutInterval: 0, countdownFrom: 0 },
  ]
}

export { genId }
