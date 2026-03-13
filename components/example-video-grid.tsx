import { StyleSheet, View } from 'react-native'
import { ExampleVideoCard, type ExampleVideo } from './example-video-card'

interface ExampleVideoGridProps {
  videos: ExampleVideo[]
  thumbnailBaseUrl: string
  onVideoPress: (video: ExampleVideo) => void
}

export function ExampleVideoGrid({
  videos,
  thumbnailBaseUrl,
  onVideoPress,
}: ExampleVideoGridProps) {
  return (
    <View style={styles.grid}>
      {videos.map((video) => (
        <ExampleVideoCard
          key={video.title}
          video={video}
          onPress={() => onVideoPress(video)}
          thumbnailBaseUrl={thumbnailBaseUrl}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
})
