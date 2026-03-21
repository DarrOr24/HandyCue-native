import { useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { ProfileAvatar } from './avatar/profile-avatar'
export interface ProfileMenuItem {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
  variant?: 'default' | 'danger'
}

interface ProfileMenuProps {
  items: ProfileMenuItem[]
}

/**
 * Profile button in top-right. Shows user's avatar when logged in, else generic icon.
 * Tap opens dropdown (Account, Log in/out) — does NOT prompt to change pic.
 */
export function ProfileMenu({ items }: ProfileMenuProps) {
  const [visible, setVisible] = useState(false)
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const isAndroidLandscape = Platform.OS === 'android' && width > height

  function handleItemPress(item: ProfileMenuItem) {
    setVisible(false)
    item.onPress()
  }

  const menuContent = (
    <>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.menuItem, idx < items.length - 1 && styles.menuItemBorder]}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={item.icon}
            size={22}
            color={item.variant === 'danger' ? '#dc2626' : '#374151'}
            style={styles.menuIcon}
          />
          <Text
            style={[
              styles.menuLabel,
              item.variant === 'danger' && styles.menuLabelDanger,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  )

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.trigger}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="Profile menu"
      >
        <ProfileAvatar size="sm" isUpdatable={false} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={[
            styles.backdrop,
            isAndroidLandscape && {
              paddingRight: 16 + insets.right,
              paddingBottom: 24 + insets.bottom,
            },
          ]}
          onPress={() => setVisible(false)}
        >
          <View
            style={[styles.menu, isAndroidLandscape && { maxHeight: height * 0.55 }]}
            onStartShouldSetResponder={() => true}
          >
            {isAndroidLandscape ? (
              <ScrollView
                showsVerticalScrollIndicator={true}
                bounces={false}
                style={styles.menuScroll}
              >
                {menuContent}
              </ScrollView>
            ) : (
              menuContent
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 0,
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
  menuScroll: {
    maxHeight: '100%',
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
  menuLabelDanger: { color: '#dc2626', fontWeight: '500' },
})
