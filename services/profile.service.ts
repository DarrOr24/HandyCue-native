import { supabase } from '../lib/supabase'
import type { CueStep } from './cueCraft.types'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  img_url: string | null
  is_admin: boolean
  general_settings: Record<string, unknown>
  settings: Record<string, unknown>
  favorites: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

export async function upsertProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'username' | 'full_name' | 'img_url' | 'general_settings' | 'settings' | 'favorites'>>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

/**
 * Save feature input values to the user's profile as defaultValues.
 * Used by HoldOn, EntryBuddy, ShapeJam, DrillDJ before navigating away.
 */
export async function saveInputsToProfile(
  userId: string,
  featureKey: string,
  defaultValues: Record<string, unknown>
): Promise<void> {
  try {
    const p = await getProfile(userId)
    const current = (p?.settings as Record<string, unknown>) ?? {}
    const existing = (current[featureKey] as Record<string, unknown>) ?? {}
    await upsertProfile(userId, {
      settings: {
        ...current,
        [featureKey]: {
          ...existing,
          defaultValues: {
            ...((existing.defaultValues as Record<string, unknown>) ?? {}),
            ...defaultValues,
          },
        },
      },
    })
  } catch {
    // ignore
  }
}

/**
 * Save CueCraft sequence steps to the user's profile.
 * Used when navigating away from CueCraft to persist the current sequence.
 */
export async function saveCueCraftToProfile(
  userId: string,
  steps: CueStep[]
): Promise<void> {
  try {
    const p = await getProfile(userId)
    const current = (p?.settings as Record<string, unknown>) ?? {}
    const existing = (current.cueCraft as Record<string, unknown>) ?? {}
    await upsertProfile(userId, {
      settings: {
        ...current,
        cueCraft: {
          ...existing,
          steps,
        },
      },
    })
  } catch {
    // ignore
  }
}
