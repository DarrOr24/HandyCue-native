/**
 * Default settings for EntryBuddy feature.
 */

import type { HoldOnUserSettings } from './holdOn.settings.service'
import { getFeatureInputSettings } from './holdOn.settings.service'
import { sharedDefaults } from './holdOn.settings.service'

export type EntryBuddyUserSettings = HoldOnUserSettings & {
  inputSettings?: HoldOnUserSettings['inputSettings'] & {
    entryCount?: { min: number; step: number }
    holdTime?: { min: number; step: number }
    timeBetween?: { min: number; step: number }
  }
  defaultValues?: HoldOnUserSettings['defaultValues'] & {
    entryCount?: number
    holdTime?: number
    timeBetween?: number
  }
}

export const entryBuddyDefaults = {
  ...sharedDefaults,
  inputSettings: {
    ...sharedDefaults.inputSettings,
    entryCount: { min: 1, step: 1 },
    holdTime: { min: 0, step: 1 },
    timeBetween: { min: 0, step: 1 },
  },
  defaultValues: {
    ...sharedDefaults.defaultValues,
    entryCount: 5,
    holdTime: 1,
    timeBetween: 2,
  },
} as const

export { getFeatureInputSettings }
export { SHARED_FIELD_LIMITS } from './holdOn.settings.service'

export const ENTRY_BUDDY_FIELD_LIMITS = {
  entryCount: { minLimit: 1 },
  holdTime: { minLimit: 0 },
  timeBetween: { minLimit: 0 },
}
