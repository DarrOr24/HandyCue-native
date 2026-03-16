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
  /** When true, card uses calculated height for portrait fit. */
  flexible?: boolean
  /** Card height when flexible (responsive to screen size). */
  cardHeight?: number
}

export function FeatureCard({ label, subtitle, img, onPress, imageZoom = 1, inGrid, flexible, cardHeight = 100 }: FeatureCardProps) {
  const zoom = imageZoom > 1 ? imageZoom : 1
  const size = flexible ? cardHeight : 120
  const imgSize = zoom > 1 ? size / zoom : size

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !flexible && styles.cardFixed,
        inGrid && styles.cardInGrid,
        flexible && [styles.cardFlexible, { height: cardHeight }],
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.imageWrap, flexible && { width: cardHeight, height: cardHeight }]}>
        <Image
          source={img}
          style={[styles.image, { width: imgSize, height: imgSize }]}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.text, flexible && cardHeight < 108 && styles.textCompact]}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[
            styles.subtitle,
            flexible && cardHeight < 108 && styles.subtitleCompact,
          ]}
        >
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
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardFixed: {
    height: 120,
  },
  cardInGrid: {
    marginBottom: 0,
  },
  cardFlexible: {
    marginBottom: 0,
  },
  imageWrap: {
    width: 120,
    height: 120,
    backgroundColor: '#eef0ef',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
  },
  text: {
    flex: 1,
    minWidth: 0,
    padding: 18,
    justifyContent: 'center',
  },
  textCompact: {
    padding: 12,
  },
  label: { fontSize: 19, fontWeight: '600', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 21 },
  subtitleCompact: { fontSize: 12, lineHeight: 17 },
})
