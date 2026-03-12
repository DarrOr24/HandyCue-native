import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface ExampleVideo {
  title: string
  url: string
  available?: boolean
  thumbnailUrl?: string
}

interface ExampleVideoCardProps {
  video: ExampleVideo
  onPress: () => void
  thumbnailBaseUrl?: string
}

export function ExampleVideoCard({ video, onPress, thumbnailBaseUrl }: ExampleVideoCardProps) {
  const thumbnailUrl = video.thumbnailUrl && thumbnailBaseUrl
    ? thumbnailBaseUrl + encodeURIComponent(video.thumbnailUrl)
    : null

  const isComingSoon = video.available === false

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
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
      <Text style={styles.cardTitle} numberOfLines={2}>{video.title}</Text>
    </TouchableOpacity>
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    padding: 10,
  },
})
