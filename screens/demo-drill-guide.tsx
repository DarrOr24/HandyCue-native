import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { DEMO_DRILL_GUIDES } from '../data/demo-drill-guides'
import { progressionDocScreenStyles as p } from '../theme/progression-doc-screen'

export function DemoDrillGuideScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()
  const scrollBottomPad = 32 + insets.bottom
  const instructionId = route.params?.instructionId as string | undefined
  const guide = instructionId ? DEMO_DRILL_GUIDES[instructionId] : undefined

  if (!guide) {
    return (
      <SafeAreaView style={p.container} edges={safeAreaEdges}>
        <View style={p.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={p.headerBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={p.headerTitle}>Guide</Text>
          <View style={p.headerSpacer} />
        </View>
        <View style={[p.empty, { paddingBottom: 24 + insets.bottom }]}>
          <Text style={p.emptyText}>No guide for this demo.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={p.container} edges={safeAreaEdges}>
      <View style={p.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={p.headerBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={p.headerTitle} numberOfLines={2}>
          {guide.pageTitle}
        </Text>
        <View style={p.headerSpacer} />
      </View>

      <ScrollView
        style={p.scroll}
        contentContainerStyle={[p.content, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={p.intro}>{guide.intro}</Text>

        {guide.sections.map((section) => (
          <View key={section.heading} style={p.section}>
            <Text style={p.sectionTitle}>{section.heading}</Text>
            {section.bullets?.map((line) => (
              <View key={line} style={p.bulletRow}>
                <Text style={p.bulletMark}>{'\u2022'}</Text>
                <Text style={p.bulletBody}>{line}</Text>
              </View>
            ))}
            {section.blocks?.map((block) => (
              <View key={block.title} style={p.nestedBlock}>
                <Text style={p.subsectionTitle}>{block.title}</Text>
                {block.lines.map((line) => (
                  <View key={line} style={p.bulletRow}>
                    <Text style={p.bulletMark}>{'\u2022'}</Text>
                    <Text style={p.bulletBody}>{line}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        {guide.summary ? (
          <View style={p.summaryBlock}>
            <Text style={p.summaryHeading}>Summary</Text>
            <Text style={p.summaryText}>{guide.summary}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}
