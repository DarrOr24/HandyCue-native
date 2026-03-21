import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ReactNode } from 'react'

interface InfoScreenLayoutProps {
  title: string
  children: ReactNode
}

/**
 * Reusable layout for feature info pages.
 * Header: back button, title. Scrollable content area.
 */
export function InfoScreenLayout({ title, children }: InfoScreenLayoutProps) {
  const navigation = useNavigation<any>()
  const safeAreaEdges = useSafeAreaEdges(['top', 'bottom'])

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
        <Text style={styles.title}>{title} Info</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

/** Styled text components for info page content. Use these so styling stays consistent. */
export function InfoEmphasis({ children }: { children: ReactNode }) {
  return <Text style={contentStyles.emphasis}>{children}</Text>
}

export function InfoParagraph({ children }: { children: ReactNode }) {
  return <Text style={contentStyles.paragraph}>{children}</Text>
}

export function InfoSectionTitle({ children }: { children: ReactNode }) {
  return <Text style={contentStyles.sectionTitle}>{children}</Text>
}

export function InfoBold({ children }: { children: ReactNode }) {
  return <Text style={contentStyles.bold}>{children}</Text>
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
})

const contentStyles = StyleSheet.create({
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
  bold: {
    fontWeight: '600',
  },
})
