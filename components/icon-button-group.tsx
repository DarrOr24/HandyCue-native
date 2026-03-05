import { StyleSheet, View } from 'react-native'
import { IconButton } from './icon-button'
import type { IconName } from './icon-button'

export interface IconButtonConfig {
  name: IconName
  onPress: () => void
  accessibilityLabel?: string
}

interface IconButtonGroupProps {
  configs: IconButtonConfig[]
}

/**
 * Horizontal group of icon buttons for headers.
 * Ensures consistent spacing and vertical centering across platforms.
 */
export function IconButtonGroup({ configs }: IconButtonGroupProps) {
  return (
    <View style={styles.container}>
      {configs.map((config, idx) => (
        <IconButton
          key={idx}
          name={config.name}
          onPress={config.onPress}
          variant="default"
          accessibilityLabel={config.accessibilityLabel}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 4,
  },
})
