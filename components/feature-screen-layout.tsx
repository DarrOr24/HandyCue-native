import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaEdges } from '../hooks/useSafeAreaEdges'
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
  /** Fixed header above scroll (e.g. CueCraft Sequence + Add step) */
  stickyHeader?: ReactNode
  /** Use NestableScrollContainer for drag-and-drop lists (e.g. CueCraft) */
  useNestableScroll?: boolean
  /** Wrap scroll in KeyboardAvoidingView so inputs stay visible when keyboard opens */
  useKeyboardAvoiding?: boolean
  /** Offset for KeyboardAvoidingView (e.g. header height). Defaults to 60. */
  keyboardVerticalOffset?: number
  /** CueCraft-only: left=timer+add step, right=inputs, enables drag in landscape */
  landscapeLayoutVariant?: 'default' | 'cueCraft'
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
  stickyHeader,
  useNestableScroll = false,
  useKeyboardAvoiding = false,
  keyboardVerticalOffset = 60,
  landscapeLayoutVariant = 'default',
}: FeatureScreenLayoutProps) {
  const ScrollComponent = useNestableScroll ? NestableScrollContainer : ScrollView
  const { width, height } = useWindowDimensions()
  const useLandscapeLayout =
    Platform.OS === 'android' && width > height
  const safeAreaEdges = useSafeAreaEdges(['bottom'])

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <LinearGradient
        colors={['#ffffff', '#e0f0eb']}
        style={StyleSheet.absoluteFillObject}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            styles.content,
            useLandscapeLayout && styles.contentLandscape,
          ]}
        >
        {useLandscapeLayout ? (
          landscapeLayoutVariant === 'cueCraft' ? (
            <>
              <View style={styles.cueCraftLeftColumn}>
                <View style={styles.cueCraftTopSection}>
                  <View style={styles.timerSection}>{timerContent}</View>
                  <View style={styles.actionsSection}>{actions}</View>
                </View>
                <View style={styles.cueCraftBottomSection}>
                  <View style={styles.cueCraftStickyHeaderWrap}>{stickyHeader}</View>
                  {footer && <View style={styles.footerLandscape}>{footer}</View>}
                </View>
              </View>
              <View style={styles.cueCraftRightColumn}>
                {useKeyboardAvoiding ? (
                  <KeyboardAvoidingView
                    style={styles.keyboardAvoidingWrapper}
                    behavior="padding"
                    keyboardVerticalOffset={keyboardVerticalOffset}
                  >
                    <ScrollComponent
                      style={styles.inputsSection}
                      contentContainerStyle={[
                        styles.inputsContent,
                        inputsDisabled && styles.inputsDisabled,
                      ]}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      scrollEventThrottle={16}
                      {...(Platform.OS === 'android' && { nestedScrollEnabled: true })}
                    >
                      {children}
                    </ScrollComponent>
                  </KeyboardAvoidingView>
                ) : (
                  <ScrollComponent
                    style={styles.inputsSection}
                    contentContainerStyle={[
                      styles.inputsContent,
                      inputsDisabled && styles.inputsDisabled,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                    {...(Platform.OS === 'android' && { nestedScrollEnabled: true })}
                  >
                    {children}
                  </ScrollComponent>
                )}
              </View>
            </>
          ) : (
          <>
            <View style={styles.leftColumn}>
              <View style={styles.timerActionsWrapper}>
                <View style={styles.timerSection}>{timerContent}</View>
                <View style={styles.actionsSection}>{actions}</View>
              </View>
              {footer && <View style={styles.footerLandscape}>{footer}</View>}
            </View>
            <View style={styles.rightColumn}>
              {stickyHeader}
              {useKeyboardAvoiding ? (
                <KeyboardAvoidingView
                  style={styles.keyboardAvoidingWrapper}
                  behavior="padding"
                  keyboardVerticalOffset={keyboardVerticalOffset}
                >
                  <ScrollComponent
                    style={styles.inputsSection}
                    contentContainerStyle={[
                      styles.inputsContent,
                      inputsDisabled && styles.inputsDisabled,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                    {...(Platform.OS === 'android' && { nestedScrollEnabled: true })}
                  >
                    {children}
                  </ScrollComponent>
                </KeyboardAvoidingView>
              ) : (
                <ScrollComponent
                  style={styles.inputsSection}
                  contentContainerStyle={[
                    styles.inputsContent,
                    inputsDisabled && styles.inputsDisabled,
                  ]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  scrollEventThrottle={16}
                  {...(Platform.OS === 'android' && { nestedScrollEnabled: true })}
                >
                  {children}
                </ScrollComponent>
              )}
            </View>
          </>
        )
        ) : (
          <>
            <View style={styles.timerSection}>{timerContent}</View>
            <View style={styles.actionsSection}>{actions}</View>
            {stickyHeader}
            {useKeyboardAvoiding ? (
              <KeyboardAvoidingView
                style={styles.keyboardAvoidingWrapper}
                behavior="padding"
                keyboardVerticalOffset={keyboardVerticalOffset}
              >
                <ScrollComponent
                  style={styles.inputsSection}
                  contentContainerStyle={[
                    styles.inputsContent,
                    inputsDisabled && styles.inputsDisabled,
                  ]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  scrollEventThrottle={16}
                  {...(Platform.OS === 'android' && { nestedScrollEnabled: true })}
                >
                  {children}
                </ScrollComponent>
              </KeyboardAvoidingView>
            ) : (
              <ScrollComponent
                style={styles.inputsSection}
                contentContainerStyle={[
                  styles.inputsContent,
                  inputsDisabled && styles.inputsDisabled,
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                {...(Platform.OS === 'android' && { nestedScrollEnabled: true })}
              >
                {children}
              </ScrollComponent>
            )}
            {footer && <View style={styles.footer}>{footer}</View>}
          </>
        )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  content: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  contentLandscape: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 0,
  },
  leftColumn: {
    width: LANDSCAPE_LEFT_COLUMN_WIDTH,
    marginRight: 20,
    alignItems: 'center',
  },
  cueCraftLeftColumn: {
    width: LANDSCAPE_LEFT_COLUMN_WIDTH,
    marginRight: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cueCraftTopSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cueCraftBottomSection: {
    alignSelf: 'stretch',
    paddingTop: 12,
  },
  cueCraftRightColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
  cueCraftStickyHeaderWrap: {
    alignSelf: 'stretch',
  },
  timerActionsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
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
  keyboardAvoidingWrapper: { flex: 1, minHeight: 0 },
  inputsSection: { flex: 1, width: '100%', minHeight: 0 },
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
  footerLandscape: {
    flexShrink: 0,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 0,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
