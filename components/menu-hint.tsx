import { useState, useEffect, useRef } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import {
  isMenuHintDismissed,
  setMenuHintDismissed,
  type MenuHintFeatureKey,
} from '../services/menu-hint.service'

interface MenuHintProps {
  featureKey: MenuHintFeatureKey
  /** Override the default hint text. Used for home: "Tap ⋯ to discover HandyCue's story" */
  text?: string
}

/** In Android landscape, add extra right margin to avoid Samsung nav bar */
function useHintRightMargin() {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const isAndroidLandscape = Platform.OS === 'android' && width > height
  return isAndroidLandscape ? 28 + insets.right : 28
}

/**
 * Absolute overlay: animated arrow pointing up at the ⋮ menu.
 * "Tap the … to explore the feature" (or custom text). Dismissible. Per-feature, resets on logout.
 */
export function MenuHint({ featureKey, text }: MenuHintProps) {
  const [visible, setVisible] = useState<boolean | null>(null)
  const marginRight = useHintRightMargin()
  const bounce = useRef(new Animated.Value(0)).current

  useEffect(() => {
    isMenuHintDismissed(featureKey).then((dismissed) => {
      setVisible(!dismissed)
    })
  }, [featureKey])

  useEffect(() => {
    if (visible !== true) return
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    )
    anim.start()
    return () => anim.stop()
  }, [visible, bounce])

  async function handleDismiss() {
    await setMenuHintDismissed(featureKey)
    setVisible(false)
  }

  if (visible !== true) return null

  const arrowOffset = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  })

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View
        style={[styles.bubble, { marginTop: 6, marginRight }]}
        pointerEvents="auto"
      >
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={14} color="#9ca3af" />
        </TouchableOpacity>
        <Animated.View style={[styles.arrowWrap, { transform: [{ translateY: arrowOffset }] }]}>
          <Ionicons name="chevron-up" size={18} color="#5B9A8B" />
        </Animated.View>
        <View style={styles.textRow}>
          {text ? (
            <>
              <Text style={styles.text}>Tap </Text>
              <Ionicons name="ellipsis-horizontal" size={14} color="#374151" style={styles.dotsIcon} />
              <Text style={styles.text}> {text}</Text>
            </>
          ) : (
            <>
              <Text style={styles.text}>Tap the </Text>
              <Ionicons name="ellipsis-horizontal" size={14} color="#374151" style={styles.dotsIcon} />
              <Text style={styles.text}> to explore the feature</Text>
            </>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  bubble: {
    backgroundColor: '#e8f0ee',
    paddingHorizontal: 6,
    paddingTop: 5,
    paddingBottom: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1e0dc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    maxWidth: 120,
  },
  closeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    padding: 2,
    zIndex: 1,
  },
  arrowWrap: {
    marginBottom: 1,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
  },
  dotsIcon: {
    marginHorizontal: 2,
  },
})
