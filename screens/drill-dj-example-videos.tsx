import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const SUPABASE_STORAGE_BASE =
  (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '') + '/storage/v1/object/public/example-videos/'

export interface ExampleVideo {
  title: string
  url: string
  available?: boolean
}

const DRILLDJ_VIDEOS: { section: string; videos: ExampleVideo[] }[] = [
  {
    section: 'Float drills',
    videos: [
      { title: 'Heel pulls', url: 'Float drill - heel pulls.mp4', available: false },
      { title: 'Toe pulls', url: 'Float drill - toe pulls.mp4', available: true },
      { title: 'L Shape Float', url: 'Float drill - l shape float.mp4', available: false },
    ],
  },
  {
    section: 'Slide drills',
    videos: [
      { title: 'L Shape Slide', url: 'Slide drill - l shape slide.mp4', available: false },
      { title: 'Tuck to straight', url: 'Slide drill - tuck to straight.mp4', available: false },
    ],
  },
  {
    section: 'Switch drill',
    videos: [{ title: 'Twinkle toes', url: 'Switch drill - twinkle toes.mp4', available: false }],
  },
]

export function DrillDJExampleVideosScreen() {
  const navigation = useNavigation<any>()

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {DRILLDJ_VIDEOS.map((group) => (
          <View key={group.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.section}</Text>
            {group.videos.map((video) => (
              <VideoCard key={video.title} video={video} onPress={() => handleVideoPress(video)} />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

function VideoCard({ video, onPress }: { video: ExampleVideo; onPress: () => void }) {
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
