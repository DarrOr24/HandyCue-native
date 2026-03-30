import { StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface Demo {
  title: string
  url: string
  available?: boolean
  thumbnailUrl?: string
  /** When set, show a details control that opens the drill guide (see `data/demo-drill-guides`). */
  instructionId?: string
}

/** Align the info icon with the title’s first line (same top inset + line height as the text). */
const TITLE_FONT_SIZE = 16
const TITLE_LINE_HEIGHT = 22
const INFO_ICON_SIZE = 22
/** Ionicons “i” reads slightly high vs SF Text; tiny nudge for optical alignment. */
const INFO_ICON_TOP_NUDGE = Platform.OS === 'ios' ? 2 : 0

interface DemoCardProps {
  video: Demo
  onPress: () => void
  /** Opens full-screen instructions; only shown when `video.instructionId` is set. */
  onGuidePress?: () => void
  thumbnailBaseUrl?: string
  /** Fixed width for Android landscape grid */
  cardWidth?: number
}

export function DemoCard({ video, onPress, onGuidePress, thumbnailBaseUrl, cardWidth }: DemoCardProps) {
  const thumbnailUrl = video.thumbnailUrl && thumbnailBaseUrl
    ? thumbnailBaseUrl + encodeURIComponent(video.thumbnailUrl)
    : null

  const isComingSoon = video.available === false

  const showGuide = Boolean(video.instructionId && onGuidePress)

  return (
    <View
      style={[
        styles.card,
        cardWidth != null && { width: cardWidth, marginBottom: 0 },
      ]}
    >
      <TouchableOpacity
        style={styles.thumbnailWrap}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Play demo: ${video.title}`}
      >
        <View style={styles.thumbnail}>
          {thumbnailUrl ? (
            <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailImage} resizeMode="cover" />
          ) : null}
          {isComingSoon && (
            <View style={styles.comingSoonOverlay}>
              <Text style={styles.comingSoonText}>Coming soon</Text>
            </View>
          )}
          <View style={styles.playOverlay}>
            <Ionicons
              name="play-circle"
              size={40}
              color={thumbnailUrl ? 'rgba(255,255,255,0.95)' : '#5B9A8B'}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.titleTap}
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Play demo: ${video.title}`}
        >
          <Text style={styles.cardTitle} numberOfLines={2}>
            {video.title}
          </Text>
        </TouchableOpacity>
        {showGuide ? (
          <TouchableOpacity
            onPress={() => onGuidePress?.()}
            style={styles.guideBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Drill guide: ${video.title}`}
          >
            <View style={styles.guideIconWrap}>
              <Ionicons
                name="information-circle-outline"
                size={INFO_ICON_SIZE}
                color="#5B9A8B"
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#f5f7f6',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  thumbnailWrap: {},
  thumbnail: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#e8ebe9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 4,
    gap: 2,
  },
  titleTap: {
    flex: 1,
    justifyContent: 'flex-start',
    /** Same top offset as guideBtn so text + icon share a baseline band */
    paddingTop: 2,
  },
  guideBtn: {
    minWidth: 44,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 2,
    paddingTop: 2,
    paddingBottom: 12,
  },
  guideIconWrap: {
    marginTop: INFO_ICON_TOP_NUDGE,
    height: INFO_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '500',
    lineHeight: TITLE_LINE_HEIGHT,
    color: '#374151',
    paddingRight: 4,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
})
