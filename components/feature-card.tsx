import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  PixelRatio,
} from 'react-native'

interface FeatureCardProps {
  label: string
  subtitle: string
  img: ImageSourcePropType
  onPress?: () => void
  /** Values > 1 zoom out (show more of image, subject smaller). Default 1. */
  imageZoom?: number
  /** When true, removes bottom margin (for grid layouts). */
  inGrid?: boolean
}

/** Same footprint as the progression row thumbnail — readable, not oversized on large phones. */
const THUMB_SIZE = 64

export function FeatureCard({ label, subtitle, img, onPress, imageZoom = 1, inGrid }: FeatureCardProps) {
  const fontScale = PixelRatio.getFontScale()
  const extraVerticalPad = fontScale > 1 ? Math.min(10, (fontScale - 1) * 8) : 0
  const zoom = imageZoom > 1 ? imageZoom : 1
  const imgSize = zoom > 1 ? THUMB_SIZE / zoom : THUMB_SIZE

  return (
    <TouchableOpacity
      style={[
        styles.card,
        inGrid && styles.cardInGrid,
        { paddingVertical: 12 + extraVerticalPad },
      ]}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${subtitle}`}
    >
      <View style={[styles.imageWrap, { width: THUMB_SIZE, height: THUMB_SIZE }]}>
        <Image
          source={img}
          style={[styles.image, { width: imgSize, height: imgSize }]}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  /** Matches `homeSuggestionCardStyles.card` (progression / suggestions row). */
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c5ddd4',
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInGrid: {
    width: '100%',
    alignSelf: 'stretch',
  },
  imageWrap: {
    backgroundColor: '#e8ebe9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: 2,
  },
  image: {},
  textCol: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 4,
    paddingTop: 0,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 17,
    color: '#6b7280',
    flexShrink: 1,
  },
})
