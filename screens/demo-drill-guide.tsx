import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { DEMO_DRILL_GUIDES } from '../data/demo-drill-guides'

export function DemoDrillGuideScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()
  const scrollBottomPad = 40 + insets.bottom
  const instructionId = route.params?.instructionId as string | undefined
  const guide = instructionId ? DEMO_DRILL_GUIDES[instructionId] : undefined

  if (!guide) {
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
          <Text style={styles.headerTitle}>Guide</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.empty, { paddingBottom: 24 + insets.bottom }]}>
          <Text style={styles.emptyText}>No guide for this demo.</Text>
        </View>
      </SafeAreaView>
    )
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
        <Text style={styles.headerTitle} numberOfLines={2}>
          {guide.pageTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{guide.intro}</Text>

        {guide.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            {section.bullets?.map((line) => (
              <View key={line} style={styles.bulletRow}>
                <Text style={styles.bulletMark}>{'\u2022'}</Text>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
            {section.blocks?.map((block) => (
              <View key={block.title} style={styles.block}>
                <Text style={styles.blockTitle}>{block.title}</Text>
                {block.lines.map((line) => (
                  <View key={line} style={styles.bulletRow}>
                    <Text style={styles.bulletMark}>{'\u2022'}</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        {guide.summary ? (
          <View style={styles.summaryWrap}>
            <Text style={styles.sectionHeading}>Summary</Text>
            <Text style={styles.summaryText}>{guide.summary}</Text>
          </View>
        ) : null}
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
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#374151', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  intro: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 4,
  },
  bulletMark: {
    fontSize: 17,
    color: '#6b7280',
    width: 22,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
  },
  block: { marginTop: 12 },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  summaryWrap: { marginTop: 8 },
  summaryText: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
})
