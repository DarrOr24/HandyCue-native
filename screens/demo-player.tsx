import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useVideoPlayer, VideoView } from 'expo-video'

export function DemoPlayerScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { videoUrl, title } = route.params as { videoUrl: string; title: string }
  const safeAreaEdges = useSafeAreaEdges(['top'])

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false
    p.play()
  })

  return (
    <View style={styles.container}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="contain"
        nativeControls={true}
      />
      <SafeAreaView style={styles.overlay} edges={safeAreaEdges}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})
