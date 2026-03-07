/**
 * Default settings for ShapeJam feature.
 */

export type ShapeJamUserSettings = {
  inputSettings?: {
    getReadyTime?: { min: number; step: number }
    numSets?: { min: number; step: number }
    restTime?: { min: number; step: number }
    holdTime?: { min: number; step: number }
    numReps?: { min: number; step: number }
    shapes?: string[]
  }
  defaultValues?: {
    getReadyTime?: number
    numSets?: number
    restTime?: number
    holdTime?: number
    numReps?: number
    shapes?: string[]
  }
}

export function getFeatureInputSettings(
  userSettings: ShapeJamUserSettings | null | undefined,
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

export const shapeJamDefaults = {
  ...sharedDefaults,
  inputSettings: {
    ...sharedDefaults.inputSettings,
    numReps: { min: 1, step: 1 },
    shapes: ['tuck', 'straight', 'straddle', 'pike', 'diamond'],
    holdTime: { min: 1, step: 1 },
  },
  defaultValues: {
    ...sharedDefaults.defaultValues,
    numReps: 5,
    shapes: ['tuck', 'straight'],
    holdTime: 1,
  },
} as const

export const SHARED_FIELD_LIMITS = {
  getReadyTime: { minLimit: 0 },
  numSets: { minLimit: 1 },
  restTime: { minLimit: 1 },
}

export const HOLD_TIME_LIMITS = { minLimit: 1 }
