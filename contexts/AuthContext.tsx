import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { createSessionFromUrl } from '../lib/auth-deeplink'
import { navigateWhenReady } from '../lib/navigation-ref'
import { upsertProfile } from '../services/profile.service'

interface AuthContextValue {
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({ session: null, isLoading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Handle magic link / password reset deep links
  const url = Linking.useURL()
  useEffect(() => {
    if (url && url.includes('access_token=')) {
      createSessionFromUrl(url).then((result) => {
        if (result.success && result.type === 'recovery') {
          navigateWhenReady('Account')
        }
      })
    }
  }, [url])

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setIsLoading(false)
      })
      .catch((err) => {
        if (__DEV__) console.warn('[Auth] getSession failed:', err?.message)
        setSession(null)
        setIsLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      upsertProfile(session.user.id, {}).catch((err) => {
        if (__DEV__) console.warn('[Auth] upsertProfile failed:', err?.message)
      })
    }
  }, [session?.user?.id])

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
