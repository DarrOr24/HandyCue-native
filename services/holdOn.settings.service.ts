/**
 * Default settings for HoldOn feature.
 */

export type HoldOnUserSettings = {
  inputSettings?: {
    getReadyTime?: { min: number; step: number }
    numSets?: { min: number; step: number }
    restTime?: { min: number; step: number }
    holdTime?: { min: number; step: number }
  }
  defaultValues?: {
    getReadyTime?: number
    numSets?: number
    restTime?: number
    holdTime?: number
  }
}

export function getFeatureInputSettings(
  userSettings: HoldOnUserSettings | null | undefined,
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

export const sharedDefaults = {
  inputSettings: {
    getReadyTime: { min: 0, step: 1 },
    restTime: { min: 1, step: 5 },
    numSets: { min: 1, step: 1 },
  },
  defaultValues: {
    getReadyTime: 5,
    restTime: 60,
    numSets: 1,
  },
}

export const holdOnDefaults = {
  ...sharedDefaults,
  inputSettings: {
    ...sharedDefaults.inputSettings,
    holdTime: { min: 1, step: 5 },
  },
  defaultValues: {
    ...sharedDefaults.defaultValues,
    holdTime: 60,
  },
} as const

export const SHARED_FIELD_LIMITS = {
  getReadyTime: { minLimit: 0 },
  numSets: { minLimit: 1 },
  restTime: { minLimit: 1 },
}

export const HOLD_TIME_LIMITS = { minLimit: 1 }
