import { StyleSheet, Text } from 'react-native'
import { InfoScreenLayout } from '../components/info-screen-layout'
import { ExampleVideosLink } from '../components/example-videos-link'

export function ShapeJamInfoScreen() {
  return (
    <InfoScreenLayout title="ShapeJam">
      <Text style={styles.emphasis}>
        Your voice-guided shape flow builder
      </Text>

      <Text style={styles.paragraph}>
        ShapeJam guides you through dynamic handstand shape transitions using voice prompts and timed holds.
        Select your shapes (like tuck, straddle, pike), assign hold times, and build your own sequence.
        You can add your own shape names through settings to customize the flow to your practice.
      </Text>

      <Text style={styles.paragraph}>
        The feature gives clear voice cues — helping you build a strong connection between verbal command and physical action.
        Because there's no time to prepare between shapes, your transitions become more controlled, intentional, and refined.
      </Text>

      <Text style={styles.paragraph}>
        Focus on precision, rhythm, and flow — whether you're training symmetry, creativity, or advanced transitions.
      </Text>

      <ExampleVideosLink featureKey="shapeJam" />

    </InfoScreenLayout>
  )
}

const styles = StyleSheet.create({
  emphasis: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
})
