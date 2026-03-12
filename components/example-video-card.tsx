import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface ExampleVideo {
  title: string
  url: string
  available?: boolean
}

interface ExampleVideoCardProps {
  video: ExampleVideo
  onPress: () => void
}

export function ExampleVideoCard({ video, onPress }: ExampleVideoCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnail}>
        <Ionicons name="play-circle" size={40} color="#5B9A8B" />
      </View>
      <Text style={styles.cardTitle}>{video.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7f6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e8ebe9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, color: '#374151', flex: 1 },
})
