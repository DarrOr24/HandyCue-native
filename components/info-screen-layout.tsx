import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ReactNode } from 'react'
import { progressionDocScreenStyles as p } from '../theme/progression-doc-screen'

interface InfoScreenLayoutProps {
  title: string
  children: ReactNode
}

/**
 * Feature info pages — same shell + type scale as Handstand Journey / demo drill guides.
 */
export function InfoScreenLayout({ title, children }: InfoScreenLayoutProps) {
  const navigation = useNavigation<any>()
  const safeAreaEdges = useSafeAreaEdges(['top'])
  const insets = useSafeAreaInsets()
  const scrollBottomPad = 32 + insets.bottom

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
          {title} Info
        </Text>
        <View style={p.headerSpacer} />
      </View>

      <ScrollView
        style={p.scroll}
        contentContainerStyle={[p.content, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

export function InfoEmphasis({ children }: { children: ReactNode }) {
  return <Text style={p.infoEmphasis}>{children}</Text>
}

export function InfoParagraph({ children }: { children: ReactNode }) {
  return <Text style={p.infoParagraph}>{children}</Text>
}

export function InfoSectionTitle({ children }: { children: ReactNode }) {
  return <Text style={p.sectionTitle}>{children}</Text>
}

export function InfoBold({ children }: { children: ReactNode }) {
  return <Text style={p.infoInlineBold}>{children}</Text>
}
