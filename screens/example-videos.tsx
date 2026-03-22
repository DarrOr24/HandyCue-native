import { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { ExampleVideoGrid } from '../components/example-video-grid'
import type { ExampleVideo } from '../components/example-video-card'
import { EXAMPLE_VIDEOS } from '../data/example-videos'
import {
  EXAMPLE_VIDEOS_STORAGE_BASE,
  getExampleVideoUrl,
} from '../services/example-videos.service'

export function ExampleVideosScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const [scrollHeight, setScrollHeight] = useState(0)
  const featureKey = route.params?.featureKey ?? 'drillDJ'
  const config = EXAMPLE_VIDEOS[featureKey]
  const safeAreaEdges = useSafeAreaEdges(['top', 'bottom'])

  function handleVideoPress(video: ExampleVideo) {
    if (video.available) {
      const fullUrl = getExampleVideoUrl(video.url)
      navigation.navigate('ExampleVideoPlayer', { videoUrl: fullUrl, title: video.title })
    } else {
      Alert.alert(
        'Coming soon',
        'This example video will be uploaded soon. Check back later!'
      )
    }
  }

  if (!config) {
    return (
      <SafeAreaView style={styles.container} edges={safeAreaEdges}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Example videos</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No example videos for this feature yet.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const pageTitle = `${config.title} – Example videos`

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>{pageTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.scroll} onLayout={(e) => setScrollHeight(e.nativeEvent.layout.height)}>
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ExampleVideoGrid
          videos={config.videos}
          thumbnailBaseUrl={EXAMPLE_VIDEOS_STORAGE_BASE}
          onVideoPress={handleVideoPress}
          containerHeight={scrollHeight}
        />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  section: { marginBottom: 24 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
})
