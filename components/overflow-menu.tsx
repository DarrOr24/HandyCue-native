import { useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { IconName } from './icon-button'

export interface OverflowMenuItem {
  icon: IconName
  label: string
  onPress: () => void
}

interface OverflowMenuProps {
  items: OverflowMenuItem[]
}

/**
 * Three-dots overflow menu. Tap to open a dropdown with all actions.
 */
export function OverflowMenu({ items }: OverflowMenuProps) {
  const [visible, setVisible] = useState(false)

  function handleItemPress(item: OverflowMenuItem) {
    setVisible(false)
    item.onPress()
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.trigger}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="More options"
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="#374151" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.menu} onStartShouldSetResponder={() => true}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.menuItem, idx < items.length - 1 && styles.menuItemBorder]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={22} color="#374151" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  menuIcon: { marginRight: 12 },
  menuLabel: { fontSize: 16, color: '#374151' },
})
