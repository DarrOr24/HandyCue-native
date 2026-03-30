import { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { DemoGrid } from '../components/demo-grid'
import type { Demo } from '../components/demo-card'
import { DEMOS } from '../data/demos'
import {
  DEMOS_STORAGE_BASE,
  getDemoVideoUrl,
} from '../services/demos.service'

export function DemosScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const [scrollHeight, setScrollHeight] = useState(0)
  const featureKey = route.params?.featureKey ?? 'drillDJ'
  const config = DEMOS[featureKey]
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()
  const scrollBottomPad = 40 + insets.bottom

  function handleVideoPress(video: Demo) {
    if (video.available) {
      const fullUrl = getDemoVideoUrl(video.url)
      navigation.navigate('DemoPlayer', { videoUrl: fullUrl, title: video.title })
    } else {
      Alert.alert(
        'Coming soon',
        'This demo will be uploaded soon. Check back later!'
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
          <Text style={styles.title}>Demos</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.empty, { paddingBottom: 24 + insets.bottom }]}>
          <Text style={styles.emptyText}>No demos for this feature yet.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const pageTitle = `${config.title} – Demos`
  const hasDrillGuides = config.videos.some((v) => v.instructionId)

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
          contentContainerStyle={[styles.content, { paddingBottom: scrollBottomPad }]}
          showsVerticalScrollIndicator={false}
        >
          {hasDrillGuides ? (
            <Text style={styles.guideHint}>
              Some demos include a written drill guide—tap the info icon for technique, progressions, and more.
            </Text>
          ) : null}
          <DemoGrid
          videos={config.videos}
          thumbnailBaseUrl={DEMOS_STORAGE_BASE}
          onVideoPress={handleVideoPress}
          onGuidePress={(video) => {
            if (video.instructionId) {
              navigation.navigate('DemoDrillGuide', { instructionId: video.instructionId })
            }
          }}
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
  content: { paddingHorizontal: 20, paddingTop: 24 },
  guideHint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    marginBottom: 16,
  },
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
