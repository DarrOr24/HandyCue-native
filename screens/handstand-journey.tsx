import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  HANDSTAND_JOURNEY_FOOTNOTE,
  HANDSTAND_JOURNEY_INTRO,
  HANDSTAND_JOURNEY_STAGES,
  HANDSTAND_JOURNEY_TITLE,
} from '../data/handstand-journey'
import { findDemoVideo } from '../data/demos'
import { getDemoVideoUrl } from '../services/demos.service'

export function HandstandJourneyScreen() {
  const navigation = useNavigation<any>()
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()

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
        <Text style={styles.headerTitle} numberOfLines={2}>
          {HANDSTAND_JOURNEY_TITLE}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{HANDSTAND_JOURNEY_INTRO}</Text>

        {HANDSTAND_JOURNEY_STAGES.map((s) => (
          <View key={s.stage} style={styles.stage}>
            <Text style={styles.stageLabel}>Stage {s.stage}</Text>
            <Text style={styles.stageTitle}>{s.title}</Text>
            <Text style={styles.goal}>
              <Text style={styles.goalBold}>Goal: </Text>
              {s.goal}
            </Text>
            {s.bullets.map((line) => (
              <View key={line} style={styles.bulletRow}>
                <Text style={styles.bulletMark}>{'\u2022'}</Text>
                <Text style={styles.bulletBody}>{line}</Text>
              </View>
            ))}
            {s.moveOn ? (
              <Text style={styles.moveOn}>
                <Text style={styles.moveOnBold}>Next: </Text>
                {s.moveOn}
              </Text>
            ) : null}
            {s.demosLink ? (
              <View style={styles.demosLinkRow}>
                <TouchableOpacity
                  style={[styles.demosLinkBtn, styles.demosLinkBtnPrimary]}
                  onPress={() => {
                    const link = s.demosLink!
                    const demo = findDemoVideo(link.featureKey, link.videoUrl)
                    if (demo?.available === false) {
                      Alert.alert(
                        'Coming soon',
                        'This demo will be uploaded soon. Check back later!'
                      )
                      return
                    }
                    navigation.navigate('DemoPlayer', {
                      videoUrl: getDemoVideoUrl(link.videoUrl),
                      title: demo?.title ?? 'Demo',
                    })
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Watch demo video for ${s.title}`}
                >
                  <Ionicons name="play-circle-outline" size={22} color="#fff" />
                  <Text style={styles.demosLinkBtnTextPrimary}>Watch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demosLinkBtn, styles.demosLinkBtnSecondary]}
                  onPress={() => {
                    const link = s.demosLink!
                    const demo = findDemoVideo(link.featureKey, link.videoUrl)
                    if (!demo?.instructionId) {
                      Alert.alert(
                        'Guide unavailable',
                        'There is no written guide for this demo yet.'
                      )
                      return
                    }
                    navigation.navigate('DemoDrillGuide', {
                      instructionId: demo.instructionId,
                    })
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Open technique guide for ${s.title}`}
                >
                  <Ionicons name="information-circle-outline" size={22} color="#5B9A8B" />
                  <Text style={styles.demosLinkBtnTextSecondary}>Guide</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ))}

        <View style={styles.footnote}>
          <Text style={styles.footnoteText}>{HANDSTAND_JOURNEY_FOOTNOTE}</Text>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  intro: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  stage: {
    marginBottom: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B9A8B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  goal: { fontSize: 16, color: '#4b5563', lineHeight: 22, marginBottom: 10 },
  goalBold: { fontWeight: '600', color: '#374151' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletMark: {
    fontSize: 16,
    color: '#6b7280',
    width: 18,
    lineHeight: 22,
  },
  bulletBody: { flex: 1, fontSize: 16, color: '#374151', lineHeight: 22 },
  moveOn: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 21,
    marginTop: 8,
    fontStyle: 'italic',
  },
  moveOnBold: { fontWeight: '600', fontStyle: 'normal', color: '#374151' },
  demosLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  demosLinkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  demosLinkBtnPrimary: {
    backgroundColor: '#5B9A8B',
  },
  demosLinkBtnSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#5B9A8B',
  },
  demosLinkBtnTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  demosLinkBtnTextSecondary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B9A8B',
    textAlign: 'center',
  },
  footnote: {
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  footnoteText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    fontStyle: 'italic',
  },
})
