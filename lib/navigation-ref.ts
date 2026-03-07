import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never)
    return true
  }
  return false
}

/** Navigate when ready, retrying up to maxAttempts times. */
export function navigateWhenReady(name: string, params?: object, maxAttempts = 10) {
  if (navigate(name, params)) return
  let attempts = 0
  const id = setInterval(() => {
    attempts++
    if (navigate(name, params) || attempts >= maxAttempts) clearInterval(id)
  }, 50)
}
