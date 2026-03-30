import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { DRILL_IDEAS, type DrillIdeasFeatureKey } from '../data/drill-ideas'
import { progressionDocScreenStyles as p } from '../theme/progression-doc-screen'

export function DrillIdeasScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const featureKey = (route.params?.featureKey ?? 'holdOn') as DrillIdeasFeatureKey
  const config = DRILL_IDEAS[featureKey]
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()
  const scrollBottomPad = 32 + insets.bottom

  if (!config) {
    return null
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
          {config.title} – Drill Ideas
        </Text>
        <View style={p.headerSpacer} />
      </View>

      <ScrollView
        style={p.scroll}
        contentContainerStyle={[p.content, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {config.intro ? <Text style={p.intro}>{config.intro}</Text> : null}

        {config.sections.map((section, idx) => (
          <View
            key={idx}
            style={[p.section, section.majorSection && idx > 0 ? p.sectionMajorTop : null]}
          >
            {section.title ? <Text style={p.sectionTitle}>{section.title}</Text> : null}
            {section.content ? (
              <Text
                style={[p.body, section.items?.length ? p.bodyTightBelow : null]}
              >
                {section.content}
              </Text>
            ) : null}
            {section.items?.length ? (
              <View>
                {section.items.map((item, i) => (
                  <View key={i} style={p.bulletRow}>
                    <Text style={p.bulletMark}>{'\u2022'}</Text>
                    <Text style={p.bulletBody}>{item}</Text>
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
