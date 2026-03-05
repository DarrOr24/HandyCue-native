import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FeatureCard } from './components/FeatureCard'

const FEATURES = [
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
          <FeatureCard key={f.id} label={f.label} subtitle={f.subtitle} img={f.img} />
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
})
