/**
 * Menu hint - per-feature "tap ⋮ for more options" overlay.
 * Shown first time on each feature until dismissed. Reset on logout.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@handycue/menuHintDismissed'

export type MenuHintFeatureKey = 'holdOn' | 'entryBuddy' | 'shapeJam' | 'drillDJ' | 'cueCraft'

async function getDismissed(): Promise<Record<MenuHintFeatureKey, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return {} as Record<MenuHintFeatureKey, boolean>
    return JSON.parse(raw) as Record<MenuHintFeatureKey, boolean>
  } catch {
    return {} as Record<MenuHintFeatureKey, boolean>
  }
}

export async function isMenuHintDismissed(featureKey: MenuHintFeatureKey): Promise<boolean> {
  const dismissed = await getDismissed()
  return !!dismissed[featureKey]
}

export async function setMenuHintDismissed(featureKey: MenuHintFeatureKey): Promise<void> {
  const dismissed = await getDismissed()
  dismissed[featureKey] = true
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed))
}

/** Call when user logs out to reset hint state for next login. */
export async function clearMenuHintDismissed(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY)
}
