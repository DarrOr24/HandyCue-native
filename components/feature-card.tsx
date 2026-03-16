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
}

export function FeatureCard({ label, subtitle, img, onPress, imageZoom = 1, inGrid }: FeatureCardProps) {
  const zoom = imageZoom > 1 ? imageZoom : 1
  const imgSize = zoom > 1 ? 120 / zoom : 120

  return (
    <TouchableOpacity
      style={[styles.card, inGrid && styles.cardInGrid]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image
          source={img}
          style={[styles.image, { width: imgSize, height: imgSize }]}
          resizeMode="cover"
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    height: 120,
    backgroundColor: '#f5f7f6',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardInGrid: {
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
    padding: 18,
    justifyContent: 'center',
  },
  label: { fontSize: 19, fontWeight: '600', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 21 },
})
