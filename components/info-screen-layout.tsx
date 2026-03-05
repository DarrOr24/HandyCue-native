import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
