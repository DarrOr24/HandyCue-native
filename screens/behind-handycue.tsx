import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useFonts, DancingScript_400Regular } from '@expo-google-fonts/dancing-script'
import {
  InfoEmphasis,
  InfoParagraph,
  InfoSectionTitle,
} from '../components/info-screen-layout'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'

const CONTACT_EMAIL = 'darrmorgan@gmail.com'

export function BehindHandyCueScreen() {
  const navigation = useNavigation<any>()
  const [fontsLoaded] = useFonts({ DancingScript_400Regular })
  const safeAreaEdges = useSafeAreaEdges(['top', 'bottom'])

  function handleContact() {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`)
  }

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Behind HandyCue</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoEmphasis>Built from practice.</InfoEmphasis>

        <InfoParagraph>
          In my own handstand training, I used a metronome set to 60 BPM to pace my holds,
          counting beats in my head while upside down. For transitions and entries, I tried to stay
          consistent, but keeping time on my own felt distracting and imprecise.
        </InfoParagraph>

        <InfoParagraph>
          I started imagining a better way: a tool that could support clean timing, give structure
          to my drills, and help me stay fully focused in the moment. That's where HandyCue began,
          from a real need and a real practice.
        </InfoParagraph>

        <InfoParagraph>
          Only later did I realize the deeper impact of well-timed cues: reacting in real time,
          rather than anticipating, builds sharper awareness, better rhythm, and true control. That
          insight became the foundation of everything HandyCue offers.
        </InfoParagraph>

        <InfoSectionTitle>HandyCue – Your Training Partner</InfoSectionTitle>
        <InfoParagraph>
          HandyCue offers real-time verbal cues and customizable pacing across holds, entries,
          shapes, and sequences.
        </InfoParagraph>

        <Text style={[styles.signature, fontsLoaded && { fontFamily: 'DancingScript_400Regular' }]}>
          Darr Or
        </Text>

        <TouchableOpacity onPress={handleContact} style={styles.contactLink}>
          <Text style={styles.contactText}>Questions? Get in touch</Text>
          <Ionicons name="mail-outline" size={18} color="#5B9A8B" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  signature: {
    fontSize: 22,
    color: '#374151',
    marginTop: 8,
    marginBottom: 32,
    alignSelf: 'flex-end',
    marginRight: 24,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 17,
    color: '#5B9A8B',
    fontWeight: '500',
  },
})
