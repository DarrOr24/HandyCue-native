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
}

/**
 * Two compact cards: Demos and Drill Ideas — same border/shadow vibe as the progression guide.
 */
export function HomeLinksCards({ inGrid }: HomeLinksCardsProps = {}) {
  const navigation = useNavigation<any>()
  const [exampleMenuVisible, setExampleMenuVisible] = useState(false)
  const [drillMenuVisible, setDrillMenuVisible] = useState(false)

  function handleExampleSelect(featureKey: string) {
    setExampleMenuVisible(false)
    navigation.navigate('Demos', { featureKey })
  }

  function handleDrillSelect(featureKey: string) {
    setDrillMenuVisible(false)
    navigation.navigate('DrillIdeas', { featureKey })
  }

  const cardStyle = [styles.card, inGrid && styles.cardInGrid]

  return (
    <>
      <View style={[styles.row, inGrid && styles.rowInGrid]}>
        <TouchableOpacity
          style={cardStyle}
          activeOpacity={0.75}
          onPress={() => setExampleMenuVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Demos, choose a feature"
        >
          <View style={styles.iconWrap}>
            <Ionicons name="play-circle" size={40} color="#5B9A8B" />
          </View>
          <Text style={styles.label}>Demos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={cardStyle}
          activeOpacity={0.75}
          onPress={() => setDrillMenuVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Drill ideas, choose a feature"
        >
          <View style={styles.iconWrap}>
            <Ionicons name="bulb" size={40} color="#5B9A8B" />
          </View>
          <Text style={styles.label}>Drill ideas</Text>
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
      <Pressable style={modalStyles.backdrop} onPress={onClose}>
        <View
          style={[
            modalStyles.menu,
            isAndroidLandscape && { maxHeight: height * 0.6 },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {isAndroidLandscape ? (
            <ScrollView
              showsVerticalScrollIndicator={true}
              bounces={false}
              contentContainerStyle={modalStyles.menuScrollContent}
            >
              <Text style={modalStyles.menuTitle}>Choose feature</Text>
              {FEATURE_OPTIONS.map((opt, idx) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[modalStyles.menuItem, idx < FEATURE_OPTIONS.length - 1 && modalStyles.menuItemBorder]}
                  onPress={() => onSelect(opt.id)}
                  activeOpacity={0.7}
                >
                  <Text style={modalStyles.menuLabel}>{opt.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              <Text style={modalStyles.menuTitle}>Choose feature</Text>
              {FEATURE_OPTIONS.map((opt, idx) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[modalStyles.menuItem, idx < FEATURE_OPTIONS.length - 1 && modalStyles.menuItemBorder]}
                  onPress={() => onSelect(opt.id)}
                  activeOpacity={0.7}
                >
                  <Text style={modalStyles.menuLabel}>{opt.label}</Text>
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

const PORTRAIT_CARD_GAP = 10
const LINKS_CARD_HEIGHT_MIN = 95

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: PORTRAIT_CARD_GAP,
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
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c5ddd4',
    paddingVertical: 12,
    paddingHorizontal: 10,
    minHeight: LINKS_CARD_HEIGHT_MIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardInGrid: {
    alignSelf: 'stretch',
    marginBottom: 0,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
})

const modalStyles = StyleSheet.create({
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
