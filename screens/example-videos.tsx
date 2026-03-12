import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { ExampleVideoCard, type ExampleVideo } from '../components/example-video-card'
import { EXAMPLE_VIDEOS } from '../data/example-videos'

const SUPABASE_STORAGE_BASE =
  (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '') + '/storage/v1/object/public/example-videos/'

export function ExampleVideosScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const featureKey = route.params?.featureKey ?? 'drillDJ'
  const config = EXAMPLE_VIDEOS[featureKey]

  function handleVideoPress(video: ExampleVideo) {
    if (video.available) {
      const fullUrl = SUPABASE_STORAGE_BASE + encodeURIComponent(video.url)
      Linking.openURL(fullUrl).catch(() => {})
    } else {
      Alert.alert(
        'Coming soon',
        'This example video will be uploaded soon. Check back later!'
      )
    }
  }

  if (!config) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {config.sections.map((group) => (
          <View key={group.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.section}</Text>
            {group.videos.map((video) => (
              <ExampleVideoCard
                key={video.title}
                video={video}
                onPress={() => handleVideoPress(video)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
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
