import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const FEATURE_OPTIONS = [
  { id: 'holdOn' as const, label: 'HoldOn' },
  { id: 'entryBuddy' as const, label: 'EntryBuddy' },
  { id: 'shapeJam' as const, label: 'ShapeJam' },
  { id: 'drillDJ' as const, label: 'DrillDJ' },
]

interface HomeLinksCardsProps {
  inGrid?: boolean
  flexible?: boolean
  cardHeight?: number
  /** When true, use minHeight so cards can grow with scaled-up text. */
  allowGrow?: boolean
}

/**
 * Two compact cards for the home screen: Example Videos and Drill Ideas.
 * Each opens a feature picker, then navigates to the appropriate screen.
 */
export function HomeLinksCards({ inGrid, flexible, cardHeight = 100, allowGrow }: HomeLinksCardsProps = {}) {
  const navigation = useNavigation<any>()
  const [exampleMenuVisible, setExampleMenuVisible] = useState(false)
  const [drillMenuVisible, setDrillMenuVisible] = useState(false)

  function handleExampleSelect(featureKey: string) {
    setExampleMenuVisible(false)
    navigation.navigate('ExampleVideos', { featureKey })
  }

  function handleDrillSelect(featureKey: string) {
    setDrillMenuVisible(false)
    navigation.navigate('DrillIdeas', { featureKey })
  }

  const cardStyle = [
    styles.card,
    (flexible || inGrid || allowGrow) && [
      styles.cardFlexible,
      allowGrow ? { minHeight: LINKS_CARD_HEIGHT_MIN, paddingVertical: 4, justifyContent: 'flex-start' } : cardHeight && { height: cardHeight },
    ],
    inGrid && styles.cardInGrid,
    inGrid && allowGrow && { alignSelf: 'stretch' },
  ]

  return (
    <>
      <View
        style={[
          styles.row,
          flexible && { gap: PORTRAIT_CARD_GAP },
          inGrid && styles.rowInGrid,
          inGrid && allowGrow && { flex: 1 },
        ]}
      >
        <TouchableOpacity
          style={cardStyle}
          activeOpacity={0.7}
          onPress={() => setExampleMenuVisible(true)}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="play-circle" size={40} color="#6b7280" />
          </View>
          <Text style={[styles.label, flexible && cardHeight && cardHeight < 108 && !allowGrow && styles.labelCompact]}>
            Example Videos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={cardStyle}
          activeOpacity={0.7}
          onPress={() => setDrillMenuVisible(true)}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="bulb" size={40} color="#6b7280" />
          </View>
          <Text style={[styles.label, flexible && cardHeight && cardHeight < 108 && !allowGrow && styles.labelCompact]}>
            Drill Ideas
          </Text>
        </TouchableOpacity>
      </View>

      <FeaturePickerModal
        visible={exampleMenuVisible}
        onClose={() => setExampleMenuVisible(false)}
        onSelect={handleExampleSelect}
      />
      <FeaturePickerModal
        visible={drillMenuVisible}
        onClose={() => setDrillMenuVisible(false)}
        onSelect={handleDrillSelect}
      />
    </>
  )
}

const PORTRAIT_CARD_GAP = 10
const LINKS_CARD_HEIGHT_MIN = 95 // Same as feature cards – flexible when font scale > 1

function FeaturePickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean
  onClose: () => void
  onSelect: (featureKey: string) => void
}) {
  const { width, height } = useWindowDimensions()
  const isAndroidLandscape = Platform.OS === 'android' && width > height

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.menu,
            isAndroidLandscape && { maxHeight: height * 0.6 },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {isAndroidLandscape ? (
            <ScrollView
              showsVerticalScrollIndicator={true}
              bounces={false}
              contentContainerStyle={styles.menuScrollContent}
            >
              <Text style={styles.menuTitle}>Choose feature</Text>
              {FEATURE_OPTIONS.map((opt, idx) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.menuItem, idx < FEATURE_OPTIONS.length - 1 && styles.menuItemBorder]}
                  onPress={() => onSelect(opt.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuLabel}>{opt.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              <Text style={styles.menuTitle}>Choose feature</Text>
              {FEATURE_OPTIONS.map((opt, idx) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.menuItem, idx < FEATURE_OPTIONS.length - 1 && styles.menuItemBorder]}
                  onPress={() => onSelect(opt.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuLabel}>{opt.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
    marginBottom: 14,
  },
  rowInGrid: {
    marginBottom: 0,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0ebe6',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5ddd0',
    minHeight: 72,
    paddingVertical: 12,
  },
  cardFlexible: {
    marginBottom: 0,
  },
  cardInGrid: {
    marginBottom: 0,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  labelCompact: {
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  menuLabel: { fontSize: 16, color: '#374151', fontWeight: '500' },
  menuScrollContent: {
    paddingBottom: 16,
  },
})
