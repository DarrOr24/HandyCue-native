import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native'
import { DemoCard, type Demo } from './demo-card'

const CARD_GAP = 12
const CONTENT_PADDING_VERTICAL = 48
const CARD_TITLE_HEIGHT = 44
const THUMBNAIL_ASPECT = 9 / 16

interface DemoGridProps {
  videos: Demo[]
  thumbnailBaseUrl: string
  onVideoPress: (video: Demo) => void
  onGuidePress?: (video: Demo) => void
  /** Measured ScrollView height for Android landscape card sizing */
  containerHeight?: number
}

export function DemoGrid({
  videos,
  thumbnailBaseUrl,
  onVideoPress,
  onGuidePress,
  containerHeight,
}: DemoGridProps) {
  const { width, height } = useWindowDimensions()
  const isAndroidLandscape = Platform.OS === 'android' && width > height

  const gridStyle = isAndroidLandscape ? styles.gridLandscape : styles.grid
  const availableHeight = containerHeight
    ? containerHeight - CONTENT_PADDING_VERTICAL
    : height - 120
  const cardWidth = isAndroidLandscape
    ? Math.max(120, Math.min(320, (availableHeight - CARD_TITLE_HEIGHT) * THUMBNAIL_ASPECT))
    : undefined

  return (
    <View style={gridStyle}>
      {videos.map((video) => (
        <DemoCard
          key={video.title}
          video={video}
          onPress={() => onVideoPress(video)}
          onGuidePress={
            video.instructionId && onGuidePress
              ? () => onGuidePress(video)
              : undefined
          }
          thumbnailBaseUrl={thumbnailBaseUrl}
          cardWidth={cardWidth}
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
  gridLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
})
