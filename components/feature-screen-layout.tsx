import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReactNode } from 'react'

interface FeatureScreenLayoutProps {
  timerContent: ReactNode
  actions: ReactNode
  children: ReactNode
  inputsDisabled?: boolean
  footer?: ReactNode
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
}: FeatureScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.timerSection}>{timerContent}</View>

        <View style={styles.actionsSection}>{actions}</View>

        <View style={[styles.inputsSection, inputsDisabled && styles.inputsDisabled]}>
          {children}
        </View>

        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },
  timerSection: {
    marginTop: -36,
    marginBottom: 8,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  inputsSection: { flex: 1 },
  inputsDisabled: {
    opacity: 0.5,
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
