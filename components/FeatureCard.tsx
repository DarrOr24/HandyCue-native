import { StyleSheet, Text, View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'

interface FeatureCardProps {
  label: string
  subtitle: string
  img: ImageSourcePropType
}

export function FeatureCard({ label, subtitle, img }: FeatureCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
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
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageWrap: {
    width: 100,
    height: 100,
    backgroundColor: '#e8e8e8',
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20 },
})
