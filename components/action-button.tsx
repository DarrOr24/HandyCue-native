import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type ActionButtonVariant = 'primary' | 'secondary' | 'danger'

interface ActionButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  onPress: () => void
  disabled?: boolean
  variant?: ActionButtonVariant
  size?: number
}

const variantStyles = {
  primary: { bg: '#5B9A8B', icon: '#fff' },
  secondary: { bg: '#e8ebe9', icon: '#4a5568' },
  danger: { bg: '#c99b9b', icon: '#fff' },
}

export function ActionButton({
  icon,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 24,
}: ActionButtonProps) {
  const { bg, icon: iconColor } = variantStyles[variant]

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: bg },
        disabled && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={size} color={iconColor} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.45,
  },
})
