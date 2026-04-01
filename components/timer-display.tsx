import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface TimerDisplayProps {
  content?: string | React.ReactNode | null
  /**
   * Smaller footprint in the header row. Defaults to portrait (`width <= height`) so feature screens stay consistent.
   * Pass `false` to force the large watch face in portrait (rare).
   */
  compact?: boolean
}

export function TimerDisplay({ content, compact: compactOverride }: TimerDisplayProps) {
  const { width, height } = useWindowDimensions()
  const compact = compactOverride ?? width <= height
  const isEmpty = content === null || content === undefined || content === ''
  const cell = compact ? styles.watchCellCompact : styles.watchCell
  const textStyle = compact ? styles.textCompact : styles.text

  return (
    <View style={cell}>
      <View style={styles.inner}>
        {isEmpty ? (
          <Ionicons name="timer-outline" size={compact ? 40 : 48} color="#5B9A8B" />
        ) : typeof content === 'string' ? (
          <Text style={textStyle} numberOfLines={1} adjustsFontSizeToFit>
          {content}
        </Text>
        ) : (
          content
        )}
      </View>
    </View>
  )
}

const watchShadow =
  Platform.OS === 'ios'
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      }
    : {
        elevation: 8,
      }

const styles = StyleSheet.create({
  /** Landscape “digital watch” face — wider than tall, softly rounded corners. */
  watchCell: {
    width: 152,
    height: 78,
    borderRadius: 14,
    alignSelf: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...watchShadow,
  },
  watchCellCompact: {
    width: 132,
    height: 68,
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...watchShadow,
  },
  inner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
    minWidth: 72,
    textAlign: 'center',
    color: '#374151',
  },
  textCompact: {
    fontSize: 22,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
    minWidth: 56,
    textAlign: 'center',
    color: '#374151',
  },
})
