import { StyleSheet, Text, View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'

interface FeatureCardProps {
  label: string
  subtitle: string
  img: ImageSourcePropType
  onPress?: () => void
  /** Values > 1 zoom out (show more of image, subject smaller). Default 1. */
  imageZoom?: number
  /** When true, removes bottom margin (for grid layouts). */
  inGrid?: boolean
  /** Card/image size. 95 compact, 120 larger. Default 95. Used in portrait; grid has its own sizing. */
  cardSize?: number
}

const CARD_SIZE_SMALL = 95
const CARD_SIZE_LARGE = 120

export function FeatureCard({ label, subtitle, img, onPress, imageZoom = 1, inGrid, cardSize = CARD_SIZE_SMALL }: FeatureCardProps) {
  const size = inGrid ? CARD_SIZE_SMALL : cardSize
  const zoom = imageZoom > 1 ? imageZoom : 1
  const imgSize = zoom > 1 ? size / zoom : size

  return (
    <TouchableOpacity
      style={[
        styles.card,
        inGrid && styles.cardInGrid,
        { minHeight: size, alignItems: 'center' },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.imageWrap, { width: size, height: size }]}>
        <Image
          source={img}
          style={[styles.image, { width: imgSize, height: imgSize }]}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.text, size === CARD_SIZE_LARGE ? styles.textLarge : styles.textCompact]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f7f6',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardInGrid: {},
  imageWrap: {
    backgroundColor: '#eef0ef',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {},
  text: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  textCompact: {
    padding: 6,
  },
  textLarge: {
    padding: 14,
  },
  label: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
  subtitle: { fontSize: 17, color: '#555', lineHeight: 24 },
})
