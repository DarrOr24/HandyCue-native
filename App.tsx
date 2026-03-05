import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Feature {
  id: string
  label: string
  subtitle: string
  img: ImageSourcePropType
}

const FEATURES: Feature[] = [
  { id: 'holdOn', label: 'HoldOn', subtitle: 'Your voice-guided timer for balance and endurance holds', img: require('./assets/imgs/straight-handstand.png') },
  { id: 'entryBuddy', label: 'EntryBuddy', subtitle: 'Your smart counter for handstand entries', img: require('./assets/imgs/straddle-handstand.png') },
  { id: 'shapeJam', label: 'ShapeJam', subtitle: 'Your dynamic guide for handstand shape switches', img: require('./assets/imgs/diamond-handstand.png') },
  { id: 'drillDJ', label: 'DrillDJ', subtitle: 'Your tempo-driven, voice-guided drill companion', img: require('./assets/imgs/split-leg-handstand.png') },
]

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>HandyCue</Text>
        <Text style={styles.subtitle}>Coach Kit</Text>
      </View>

      <Text style={styles.sectionTitle}>Explore Coach's Features</Text>
      {FEATURES.map((f) => (
        <TouchableOpacity key={f.id} style={styles.tile} activeOpacity={0.7}>
          <Image source={f.img} style={styles.tileImage} resizeMode="cover" />
          <View style={styles.tileText}>
            <Text style={styles.tileLabel}>{f.label}</Text>
            <Text style={styles.tileSubtitle}>{f.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <StatusBar style="auto" />
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  tile: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tileImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
  },
  tileText: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  tileLabel: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  tileSubtitle: { fontSize: 14, color: '#666', lineHeight: 20 },
})
