/**
 * Default settings for DrillDJ feature.
 */

export type DrillDJUserSettings = {
  inputSettings?: {
    getReadyTime?: { min: number; max: number; step: number }
    numSets?: { min: number; max: number; step: number }
    restTime?: { min: number; max: number; step: number }
    numReps?: { min: number; max: number; step: number }
    floatTime?: { min: number; max: number; step: number }
    timeBetweenFloats?: { min: number; max: number; step: number }
    switchTime?: { min: number; max: number; step: number }
    timeBetweenSwitches?: { min: number; max: number; step: number }
    slideTime?: { min: number; max: number; step: number }
    timeBetweenSlides?: { min: number; max: number; step: number }
  }
  defaultValues?: {
    getReadyTime?: number
    numSets?: number
    restTime?: number
    numReps?: number
    floatTime?: number
    timeBetweenFloats?: number
    switchTime?: number
    timeBetweenSwitches?: number
    slideTime?: number
    timeBetweenSlides?: number
  }
}

export function getFeatureInputSettings(
  userSettings: DrillDJUserSettings | null | undefined,
  defaults: { inputSettings: Record<string, unknown>; defaultValues: Record<string, unknown> }
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

export const sharedDefaults = {
  inputSettings: {
    getReadyTime: { min: 0, max: 5, step: 1 },
    restTime: { min: 5, max: 90, step: 5 },
    numSets: { min: 1, max: 10, step: 1 },
  },
  defaultValues: {
    getReadyTime: 5,
    restTime: 60,
    numSets: 1,
  },
}

export const drillDJDefaults = {
  ...sharedDefaults,
  inputSettings: {
    ...sharedDefaults.inputSettings,
    numReps: { min: 1, max: 10, step: 1 },
    floatTime: { min: 1, max: 300, step: 1 },
    timeBetweenFloats: { min: 0, max: 300, step: 1 },
    switchTime: { min: 0, max: 300, step: 1 },
    timeBetweenSwitches: { min: 0, max: 300, step: 1 },
    slideTime: { min: 1, max: 300, step: 1 },
    timeBetweenSlides: { min: 0, max: 300, step: 1 },
  },
  defaultValues: {
    ...sharedDefaults.defaultValues,
    numReps: 5,
    floatTime: 5,
    timeBetweenFloats: 2,
    switchTime: 2,
    timeBetweenSwitches: 0,
    slideTime: 4,
    timeBetweenSlides: 0,
  },
} as const

export const SHARED_FIELD_LIMITS = {
  getReadyTime: { minLimit: 0, maxLimit: 30 },
  numSets: { minLimit: 1, maxLimit: 20 },
  restTime: { minLimit: 5, maxLimit: 400 },
}

export const DRILL_TIME_LIMITS = { minLimit: 0, maxLimit: 300 }
