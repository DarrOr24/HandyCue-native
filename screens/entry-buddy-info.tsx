import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
      </Text>

      <View style={styles.iconSection}>
        <Text style={styles.sectionTitle}>Header icons explained</Text>
        <IconRow icon="information-circle-outline" text="View feature info" />
        <IconRow icon="mic-outline" text="Set voice for audio callouts" />
        <IconRow icon="bookmark-outline" text="Save current input as a favorite" />
        <IconRow icon="heart-outline" text="Load your saved favorites" />
        <IconRow icon="settings-outline" text="Adjust default settings" />
      </View>
    </InfoScreenLayout>
  )
}

function IconRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={iconRowStyles.row}>
      <Ionicons name={icon} size={16} color="#666" style={iconRowStyles.icon} />
      <Text style={iconRowStyles.text}>{text}</Text>
    </View>
  )
}

const iconRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon: { marginRight: 8 },
  text: { fontSize: 14, color: '#374151', flex: 1 },
})

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
  iconSection: {
    marginTop: 8,
    marginBottom: 16,
  },
})
