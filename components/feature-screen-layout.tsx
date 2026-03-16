import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode } from 'react'
import { NestableScrollContainer } from 'react-native-draggable-flatlist'

const LANDSCAPE_LEFT_COLUMN_WIDTH = 200

interface FeatureScreenLayoutProps {
  timerContent: ReactNode
  actions: ReactNode
  children: ReactNode
  inputsDisabled?: boolean
  footer?: ReactNode
  /** Use NestableScrollContainer for drag-and-drop lists (e.g. CueCraft) */
  useNestableScroll?: boolean
}

/**
 * Template layout for coach features: timer display, action buttons, inputs.
 * All features (HoldOn, EntryBuddy, ShapeJam, DrillDJ) use this structure.
 */
export function FeatureScreenLayout({
  timerContent,
  actions,
  children,
  inputsDisabled = false,
  footer,
  useNestableScroll = false,
}: FeatureScreenLayoutProps) {
  const ScrollComponent = useNestableScroll ? NestableScrollContainer : ScrollView
  const { width, height } = useWindowDimensions()
  const useLandscapeLayout =
    Platform.OS === 'android' && width > height

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LinearGradient
        colors={['#ffffff', '#e0f0eb']}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={[
          styles.content,
          useLandscapeLayout && styles.contentLandscape,
        ]}
      >
        {useLandscapeLayout ? (
          <>
            <View style={styles.leftColumn}>
              <View style={styles.timerSection}>{timerContent}</View>
              <View style={styles.actionsSection}>{actions}</View>
            </View>
            <View style={styles.rightColumn}>
              <ScrollComponent
                style={styles.inputsSection}
                contentContainerStyle={[
                  styles.inputsContent,
                  inputsDisabled && styles.inputsDisabled,
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollComponent>
              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </>
        ) : (
          <>
            <View style={styles.timerSection}>{timerContent}</View>
            <View style={styles.actionsSection}>{actions}</View>
            <ScrollComponent
              style={styles.inputsSection}
              contentContainerStyle={[
                styles.inputsContent,
                inputsDisabled && styles.inputsDisabled,
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollComponent>
            {footer && <View style={styles.footer}>{footer}</View>}
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  contentLandscape: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  leftColumn: {
    width: LANDSCAPE_LEFT_COLUMN_WIDTH,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 1,
    minWidth: 0,
  },
  timerSection: {
    marginTop: Platform.OS === 'ios' ? 0 : 8,
    marginBottom: 8,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  inputsSection: { flex: 1, width: '100%' },
  inputsContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  inputsDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexShrink: 0,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
