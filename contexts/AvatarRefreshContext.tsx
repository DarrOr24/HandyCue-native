import React, { createContext, useCallback, useContext, useState } from 'react'

interface AvatarRefreshContextValue {
  refreshTrigger: number
  refreshAvatar: () => void
}

const AvatarRefreshContext = createContext<AvatarRefreshContextValue | null>(null)

export function AvatarRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const refreshAvatar = useCallback(() => setRefreshTrigger((n) => n + 1), [])
  return (
    <AvatarRefreshContext.Provider value={{ refreshTrigger, refreshAvatar }}>
      {children}
    </AvatarRefreshContext.Provider>
  )
}

export function useAvatarRefresh() {
  const ctx = useContext(AvatarRefreshContext)
  if (!ctx) throw new Error('useAvatarRefresh must be used within AvatarRefreshProvider')
  return ctx
}
