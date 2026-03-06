import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { InfoScreenLayout } from '../components/info-screen-layout'

export function DrillDJInfoScreen() {
  return (
    <InfoScreenLayout title="DrillDJ Info">
      <Text style={styles.emphasis}>
        Your voice-guided, tempo-driven handstand drill companion
      </Text>

      <Text style={styles.paragraph}>
        DrillDJ guides you through handstand drills with audio prompts and timed cues.
        Choose your drill type (Slide, Float, or Switch), set rep counts and durations.
      </Text>

      <Text style={styles.paragraph}>
        The feature gives clear voice commands — helping you build control by responding to external cues.
        This strengthens your timing, sharpens transitions, and removes the mental delay between decision and action.
      </Text>

      <Text style={styles.paragraph}>
        Enable Metronome for a ticking sound once per second during longer phases — keeping your rhythm consistent.
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
