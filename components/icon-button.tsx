import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export type IconName = keyof typeof Ionicons.glyphMap

interface IconButtonProps {
  name: IconName
  onPress: () => void
  size?: number
  color?: string
  /** 'default' = icon only, no background. 'filled' = circular background. */
  variant?: 'default' | 'filled'
  accessibilityLabel?: string
}

/**
 * Reusable icon button for headers and toolbars.
 * Use variant="default" for header icons (no background, consistent with design).
 */
export function IconButton({
  name,
  onPress,
  size = 24,
  color = '#374151',
  variant = 'default',
  accessibilityLabel,
}: IconButtonProps) {
  const content = (
    <Ionicons name={name} size={size} color={color} />
  )

  const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 }

  if (variant === 'filled') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.touch, styles.filled]}
        hitSlop={hitSlop}
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.touch}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.6}
    >
      {content}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touch: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  filled: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
})
