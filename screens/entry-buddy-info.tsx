import { StyleSheet, Text } from 'react-native'
import { InfoScreenLayout } from '../components/info-screen-layout'

export function EntryBuddyInfoScreen() {
  return (
    <InfoScreenLayout title="EntryBuddy">
      <Text style={styles.emphasis}>
        Your smart handstand entry counter
      </Text>

      <Text style={styles.paragraph}>
        EntryBuddy guides you through handstand entries with precision and timing.
        Set your reps, sets, rest intervals, and hold times — and train with structure and flow.
      </Text>

      <Text style={styles.paragraph}>
        The feature gives clear voice cues — helping you build a strong connection between verbal
        command and physical action. Because there's no time to mentally prepare before each rep,
        you train sharper control, rhythm, and precision.
      </Text>

      <Text style={styles.paragraph}>
        Perfect for refining entry styles such as kick-ups, tucks, straddles, or pike entries —
        all with consistent timing and structured rest between sets.
        Get creative with slow press entries, kneeling entries, and more.
      </Text>

      <Text style={styles.paragraph}>
        Check out the example videos to see this feature in action.
      </Text>

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
