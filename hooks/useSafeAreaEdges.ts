import { useWindowDimensions, Platform } from 'react-native'

type Edge = 'top' | 'bottom' | 'left' | 'right'

/**
 * Returns safe area edges, adding 'right' on Android landscape for the nav bar.
 * iOS doesn't use landscape layout; only Android does (per Google requirement).
 */
export function useSafeAreaEdges(baseEdges: Edge[]): Edge[] {
  const { width, height } = useWindowDimensions()
  const isAndroidLandscape = Platform.OS === 'android' && width > height
  if (isAndroidLandscape && !baseEdges.includes('right')) {
    return [...baseEdges, 'right']
  }
  return baseEdges
}
