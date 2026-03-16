import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode, Children } from 'react'

interface SettingsScreenLayoutProps {
  title: string
  children: ReactNode
  onSave?: () => void
  onReset?: () => void
  /** When true, first child spans full width in landscape (e.g. ShapeJam shapes row) */
  firstChildFullWidthInLandscape?: boolean
}

/**
 * Reusable layout for feature settings pages.
 * Header: back, title, save (placeholder), reset (placeholder).
 */
export function SettingsScreenLayout({
  title,
  children,
  onSave,
  onReset,
  firstChildFullWidthInLandscape,
}: SettingsScreenLayoutProps) {
  const navigation = useNavigation<any>()
  const { width, height } = useWindowDimensions()
  const isAndroidLandscape = Platform.OS === 'android' && width > height

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#ffffff', '#e0f0eb']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <Text style={styles.title}>{title} Settings</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={onReset ?? (() => {})}
            style={styles.headerBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="refresh" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave ?? (() => {})}
            style={styles.headerBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="save-outline" size={22} color="#5B9A8B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isAndroidLandscape ? (
          <View style={styles.settingsGrid}>
            {Children.map(children, (child, index) => (
              <View
                style={[
                  styles.settingsGridCell,
                  firstChildFullWidthInLandscape && index === 0 && styles.settingsGridCellFullWidth,
                ]}
              >
                {child}
              </View>
            ))}
          </View>
        ) : (
          children
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  headerBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerRight: { flexDirection: 'row', gap: 8 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  settingsGridCell: {
    width: '48%',
    minWidth: '48%',
  },
  settingsGridCellFullWidth: {
    width: '100%',
    minWidth: '100%',
  },
})
