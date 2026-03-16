import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { getExampleThumbnailUrl } from '../services/example-videos.service'

const HEEL_PULLS_THUMBNAIL = 'Float drill - heel pulls.jpeg'

const FEATURE_OPTIONS = [
  { id: 'holdOn' as const, label: 'HoldOn' },
  { id: 'entryBuddy' as const, label: 'EntryBuddy' },
  { id: 'shapeJam' as const, label: 'ShapeJam' },
  { id: 'drillDJ' as const, label: 'DrillDJ' },
]

interface DrillExamplesCardProps {
  /** When true, removes bottom margin (for grid layouts). */
  inGrid?: boolean
}

/**
 * Card for the home screen that opens a feature picker, then navigates to that
 * feature's example videos page. Uses heel pulls thumbnail and distinct styling.
 */
export function DrillExamplesCard({ inGrid }: DrillExamplesCardProps = {}) {
  const navigation = useNavigation<any>()
  const [menuVisible, setMenuVisible] = useState(false)
  const [imageError, setImageError] = useState(false)

  const thumbnailUri = getExampleThumbnailUrl(HEEL_PULLS_THUMBNAIL)

  function handleFeatureSelect(featureKey: string) {
    setMenuVisible(false)
    navigation.navigate('ExampleVideos', { featureKey })
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.card, inGrid && styles.cardInGrid]}
        activeOpacity={0.7}
        onPress={() => setMenuVisible(true)}
      >
        <View style={styles.imageWrap}>
          {imageError ? (
            <Ionicons name="play-circle" size={48} color="#9ca3af" />
          ) : (
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.image}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          )}
        </View>
        <View style={styles.text}>
          <Text style={styles.label}>Example Videos</Text>
          <Text style={styles.subtitle}>
            Watch demos for HoldOn, EntryBuddy, ShapeJam & DrillDJ
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu} onStartShouldSetResponder={() => true}>
            <Text style={styles.menuTitle}>Choose feature</Text>
            {FEATURE_OPTIONS.map((opt, idx) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.menuItem, idx < FEATURE_OPTIONS.length - 1 && styles.menuItemBorder]}
                onPress={() => handleFeatureSelect(opt.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuLabel}>{opt.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    width: '100%',
    height: 120,
    backgroundColor: '#f0ebe6',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5ddd0',
  },
  cardInGrid: {
    marginBottom: 0,
  },
  imageWrap: {
    width: 120,
    height: 120,
    backgroundColor: '#e8e2d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 68,
    height: 120,
  },
  text: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  label: { fontSize: 19, fontWeight: '600', marginBottom: 6, color: '#374151' },
  subtitle: { fontSize: 14, color: '#6b7280', lineHeight: 21 },
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
})
