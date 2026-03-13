import { StyleSheet, Text } from 'react-native'
import { InfoScreenLayout } from '../components/info-screen-layout'
import { ExampleVideosLink } from '../components/example-videos-link'

export function HoldOnInfoScreen() {
  return (
    <InfoScreenLayout title="HoldOn">
      <Text style={styles.emphasis}>
        Your voice-guided counter for balance and endurance holds
      </Text>

      <Text style={styles.paragraph}>
        A hands-free timer for static holds like chest-to-wall or freestanding handstands.
        Set prep and hold durations, choose your voice style, and get smart audio callouts
        — at your chosen interval and halfway — to stay focused and fully present.
        You can accurately time your holds and rest in betweens.
      </Text>

      <Text style={styles.paragraph}>
        Also great for plank holds, passive hangs, or any other endurance-based position!
      </Text>

      <ExampleVideosLink featureKey="holdOn" />

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
