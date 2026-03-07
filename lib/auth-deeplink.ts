import { supabase } from './supabase'

const AUTH_REDIRECT = 'handycue://auth/callback'

export type AuthUrlResult = { success: boolean; type?: 'recovery' | 'magiclink' }

/**
 * Parse auth tokens from Supabase redirect URL and create session.
 * Supabase appends hash: #access_token=...&refresh_token=...&type=recovery (for reset)
 */
export async function createSessionFromUrl(url: string): Promise<AuthUrlResult> {
  try {
    const hashIndex = url.indexOf('#')
    if (hashIndex < 0) return { success: false }

    const hash = url.slice(hashIndex + 1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    let type = params.get('type') as 'recovery' | 'magiclink' | null
    if (!type && url.toLowerCase().includes('recovery')) type = 'recovery'

    if (!accessToken || !refreshToken) return { success: false }

    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (error) return { success: false }
    return { success: true, type: type ?? undefined }
  } catch {
    return { success: false }
  }
}

export function getAuthRedirectUrl(): string {
  return AUTH_REDIRECT
}
