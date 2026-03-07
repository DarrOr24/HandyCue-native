import { StyleSheet, Text, View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'

interface FeatureCardProps {
  label: string
  subtitle: string
  img: ImageSourcePropType
  onPress?: () => void
}

export function FeatureCard({ label, subtitle, img, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={img} style={styles.image} resizeMode="cover" />
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
  imageWrap: {
    width: 120,
    height: 120,
    backgroundColor: '#eef0ef',
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
