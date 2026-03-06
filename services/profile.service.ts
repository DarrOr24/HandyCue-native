import { supabase } from '../lib/supabase'

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
