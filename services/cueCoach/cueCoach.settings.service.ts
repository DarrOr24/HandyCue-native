/**
 * Default settings for cue coach features.
 * Mirrors the frontend structure (min, max, step, defaultValues).
 */

export const sharedCueCoachDefaults = {
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

export const holdOnDefaults = {
  ...sharedCueCoachDefaults,
  inputSettings: {
    ...sharedCueCoachDefaults.inputSettings,
    holdTime: { min: 5, max: 90, step: 5 },
  },
  defaultValues: {
    ...sharedCueCoachDefaults.defaultValues,
    holdTime: 60,
  },
}

export const SHARED_FIELD_LIMITS = {
  getReadyTime: { minLimit: 0, maxLimit: 30 },
  numSets: { minLimit: 1, maxLimit: 20 },
  restTime: { minLimit: 5, maxLimit: 400 },
}

export const HOLD_TIME_LIMITS = { minLimit: 5, maxLimit: 400 }
