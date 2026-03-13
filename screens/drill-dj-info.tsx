import { StyleSheet, Text } from 'react-native'
import { InfoScreenLayout } from '../components/info-screen-layout'

export function DrillDJInfoScreen() {
  return (
    <InfoScreenLayout title="DrillDJ">
      <Text style={styles.emphasis}>
        Your voice-guided, tempo-driven handstand drill companion
      </Text>

      <Text style={styles.paragraph}>
        DrillDJ guides you through handstand drills with audio prompts and timed cues.
        There are three kinds of drills, each with its own rhythm and focus.
      </Text>

      <Text style={styles.sectionTitle}>The three drills</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Slide</Text> — Slide down (timed), hold, then slide up. You control slide-down time, hold time, and slide-up time separately. Great for controlled wall slides and L-shapes.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Float</Text> — Float for a set duration, then return. The voice says "Return" and you have time between floats to reset. Builds float control and consistency.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Switch</Text> — Hold, then switch. Ideal for one-arm prep: time your hold on each hand accurately. Adjust time between switches and switch duration to match your practice.
      </Text>

      <Text style={styles.sectionTitle}>More callouts</Text>
      <Text style={styles.paragraph}>
        For Slide and Float, you can add extra callouts after the main reps. Choose "Switch legs" to do additional reps on one leg at a time, or "Both legs" for reps on both legs. You can chain them — e.g. switch legs for a few reps, then both legs for a few more. This helps balance training and adds variety without changing your main drill.
      </Text>

      <Text style={styles.paragraph}>
        The feature gives clear voice commands — helping you build control by responding to external cues.
        This strengthens your timing, sharpens transitions, and removes the mental delay between decision and action.
      </Text>

      <Text style={styles.paragraph}>
        Enable Voice count to hear the count spoken aloud during longer phases — keeping your rhythm consistent.
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
})
