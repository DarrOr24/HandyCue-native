import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { InfoScreenLayout } from '../components/info-screen-layout'

export function HoldOnInfoScreen() {
  return (
    <InfoScreenLayout title="HoldOn">
      <Text style={styles.emphasis}>
        Your voice-guided counter for balance and endurance holds
      </Text>

      <Text style={styles.paragraph}>
        A hands-free timer for static holds like chest-to-wall or freestanding handstands.
        Set prep and hold durations, choose your voice style, and get smart audio callouts
        — at your chosen interval, halfway, and a final countdown — to stay focused and fully present.
      </Text>

      <Text style={styles.paragraph}>
        Also great for plank holds, passive hangs, or any other endurance-based position!
      </Text>

      <View style={styles.iconSection}>
        <Text style={styles.sectionTitle}>Header icons explained</Text>
        <IconRow icon="information-circle-outline" text="View feature info" />
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
