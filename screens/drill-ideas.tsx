import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import {
  InfoEmphasis,
} from '../components/info-screen-layout'
import { DRILL_IDEAS, type DrillIdeasFeatureKey } from '../data/drill-ideas'

export function DrillIdeasScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const featureKey = (route.params?.featureKey ?? 'holdOn') as DrillIdeasFeatureKey
  const config = DRILL_IDEAS[featureKey]
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()

  if (!config) {
    return null
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
        <Text style={styles.title}>{config.title} – Drill Ideas</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {config.intro ? (
          <InfoEmphasis>{config.intro}</InfoEmphasis>
        ) : null}

        {config.sections.map((section, idx) => (
          <View
            key={idx}
            style={[
              styles.section,
              section.majorSection && [
                styles.majorSection,
                idx > 0 && styles.majorSectionNotFirst,
              ],
            ]}
          >
            {section.title ? (
              <Text
                style={[
                  section.majorSection ? styles.majorSectionTitle : contentStyles.sectionTitle,
                ]}
              >
                {section.title}
              </Text>
            ) : null}
            {section.content ? (
              <Text
                style={[
                  contentStyles.paragraph,
                  section.items?.length
                    ? contentStyles.paragraphBeforeList
                    : contentStyles.paragraphBeforeNextSection,
                ]}
              >
                {section.content}
              </Text>
            ) : null}
            {section.items?.length ? (
              <View style={styles.bulletList}>
                {section.items.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const contentStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  paragraphBeforeList: {
    marginBottom: 4,
  },
  paragraphBeforeNextSection: {
    marginBottom: 8,
  },
})

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
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  section: { marginBottom: 12 },
  majorSection: {
    marginBottom: 20,
  },
  majorSectionNotFirst: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  majorSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  bulletList: { marginTop: 2, marginBottom: 6 },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  bullet: {
    fontSize: 17,
    color: '#374151',
    marginRight: 8,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
  },
})
