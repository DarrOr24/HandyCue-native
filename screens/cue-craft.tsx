import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native'
import {
  ScaleDecorator,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { Ionicons } from '@expo/vector-icons'

import { TimerDisplay } from '../components/timer-display'
import { FeatureScreenLayout } from '../components/feature-screen-layout'
import { FeatureOverflowMenu } from '../components/feature-overflow-menu'
import { FeatureHeaderRight } from '../components/feature-header-right'
import { FeatureActionButtons } from '../components/feature-action-buttons'
import { CueStepRow } from '../components/cue-step-row'
import { AddStepModal } from '../components/Modals/AddStepModal'
import { SaveFavoriteModal } from '../components/Modals/SaveFavoriteModal'
import { FavoritesModal } from '../components/Modals/FavoritesModal'
import { MenuHint } from '../components/menu-hint'

import { stopSpeech, createResetSignal, speak } from '../services/core.service'
import { getVoice } from '../services/voice.service'
import { runCueSequence } from '../services/cueCraft.service'
import {
  getDefaultSteps,
  migrateSteps,
  cueCraftDefaults,
  getFeatureInputSettings,
  genId,
} from '../services/cueCraft.settings.service'
import type { CueCraftUserSettings } from '../services/cueCraft.settings.service'
import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
} from '../services/cueCraft.favorites.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, saveCueCraftToProfile } from '../services/profile.service'
import type { CueStep } from '../services/cueCraft.types'

const FEATURE_KEY = 'cueCraft'

export function CueCraftScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const { width, height } = useWindowDimensions()
  const isAndroidLandscape = Platform.OS === 'android' && width > height

  const [steps, setSteps] = useState<CueStep[]>(getDefaultSteps())
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)
  const stepsRef = useRef(steps)
  stepsRef.current = steps
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false)

  const [displayContent, setDisplayContent] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'getReady' | 'running' | 'done'>('idle')

  const favorites = getFavoritesForFeature(profile, FEATURE_KEY)

  const menuHandlersRef = useRef({
    onInfo: () => navigation.navigate('CueCraftInfo'),
    onSetVoice: () => navigation.navigate('VoiceSet'),
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: () => navigation.navigate('CueCraftSettings'),
    session,
  })
  menuHandlersRef.current = {
    onInfo: () => navigation.navigate('CueCraftInfo'),
    onSetVoice: () => navigation.navigate('VoiceSet'),
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: () => navigation.navigate('CueCraftSettings'),
    session,
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FeatureHeaderRight
          session={session}
          overflowMenu={<FeatureOverflowMenu handlersRef={menuHandlersRef} />}
        />
      ),
    })
  }, [navigation, session])

  useFocusEffect(
    useCallback(() => {
      if (!session?.user?.id) {
        setProfile(null)
        setSteps(getDefaultSteps())
        return
      }
      getProfile(session.user.id)
        .then((p) => {
          setProfile(p)
          const cueCraft = (p?.settings as Record<string, unknown>)?.cueCraft as
            | (CueCraftUserSettings & { steps?: CueStep[] })
            | undefined
          const savedSteps = cueCraft?.steps
          if (savedSteps && Array.isArray(savedSteps) && savedSteps.length > 0) {
            setSteps(migrateSteps(savedSteps))
          } else {
            setSteps(getDefaultSteps(cueCraft))
          }
        })
        .catch(() => {
          setProfile(null)
          setSteps(getDefaultSteps())
        })
      return () => {
        if (session?.user?.id && stepsRef.current.length > 0) {
          saveCueCraftToProfile(session.user.id, stepsRef.current).catch(() => {})
        }
      }
    }, [session?.user?.id])
  )

  const isRunning = phase !== 'idle' && phase !== 'done'
  useEffect(() => {
    if (isRunning) {
      void activateKeepAwakeAsync()
    } else {
      void deactivateKeepAwake()
    }
    return () => void deactivateKeepAwake()
  }, [isRunning])

  const resetSignalRef = useRef(createResetSignal())
  const voiceRef = useRef<{ identifier: string; name: string } | null>(null)

  useFocusEffect(
    useCallback(() => {
      getVoice(session?.user?.id).then((v) => {
        voiceRef.current = v
      })
      return () => {
        resetSignalRef.current.signal()
        stopSpeech()
        setPhase('idle')
        setDisplayContent(null)
      }
    }, [session?.user?.id])
  )

  useEffect(() => {
    return () => stopSpeech()
  }, [])

  function handleReset() {
    resetSignalRef.current.signal()
    stopSpeech()
    setPhase('idle')
    setDisplayContent(null)
  }

  async function handleStart() {
    if (steps.length === 0) {
      Alert.alert('Empty sequence', 'Add at least one step to run.')
      return
    }

    resetSignalRef.current.reset()
    voiceRef.current = await getVoice(session?.user?.id)

    setPhase('running')
    setDisplayContent('Ready!')

    await runCueSequence({
      steps,
      storedVoice: voiceRef.current,
      onDisplay: setDisplayContent,
      isCancelled: () => resetSignalRef.current.isCancelled(),
    })

    if (resetSignalRef.current.isCancelled()) return

    setPhase('done')
    setDisplayContent('Done!')
    await speak('Session over. Good job!', voiceRef.current)
    handleReset()
  }

  function addStep(step: CueStep) {
    setSteps((prev) => [...prev, step])
  }

  function updateStep(index: number, step: CueStep) {
    setSteps((prev) => {
      const next = [...prev]
      let s = step
      if (s.type === 'customText' && (s.duration ?? 0) > 0 && (s.countdownFrom ?? 0) > (s.duration ?? 0)) {
        s = { ...s, countdownFrom: s.duration }
      }
      next[index] = s
      return next
    })
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  function duplicateStep(index: number) {
    setSteps((prev) => {
      const step = prev[index]
      const copy = { ...step, id: genId() }
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]
    })
  }

  function moveStep(index: number, direction: 'up' | 'down') {
    setSteps((prev) => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function getCurrentInputs() {
    return { steps }
  }

  function saveFavorite(name: string) {
    const trimmed = name.trim()
    if (checkIsDuplicateName(trimmed, favorites)) {
      Alert.alert(
        'Replace favorite?',
        `There is already a favorite named "${trimmed}". Replace it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace', onPress: () => doSaveFavorite(trimmed) },
        ]
      )
    } else {
      doSaveFavorite(trimmed)
    }
  }

  async function doSaveFavorite(name: string) {
    if (!session?.user?.id) return
    try {
      await saveFavoriteForFeature({
        userId: session.user.id,
        featureKey: FEATURE_KEY,
        favoriteName: name,
        inputs: getCurrentInputs(),
      })
      setIsSaveModalOpen(false)
      const p = await getProfile(session.user.id)
      setProfile(p)
      Alert.alert('Saved', 'Favorite saved!')
    } catch (err) {
      Alert.alert('Error', (err as Error)?.message ?? 'Failed to save favorite.')
    }
  }

  function loadFavorite(name: string) {
    const fav = favorites.find((f) => f.name === name)
    if (!fav) return
    setSteps(migrateSteps(fav.inputs.steps ?? []))
    setIsFavoritesModalOpen(false)
  }

  const isActive = phase === 'getReady' || phase === 'running'
  const resetEnabled = isActive || phase === 'done'
  const inputsDisabled = isActive || phase === 'done'

  const timerContent =
    phase === 'done' ? (
      <TimerDisplay content={<Ionicons name="trophy" size={48} color="#5B9A8B" />} />
    ) : phase === 'idle' && !displayContent ? (
      <TimerDisplay
        content={<Ionicons name="construct-outline" size={48} color="#5B9A8B" />}
      />
    ) : (
      <TimerDisplay content={displayContent} />
    )

  return (
    <>
      <MenuHint featureKey="cueCraft" />
      <FeatureScreenLayout
        timerContent={timerContent}
        actions={
          <FeatureActionButtons
            primaryIcon="play"
            onPrimaryPress={handleStart}
            primaryDisabled={phase === 'getReady' || steps.length === 0}
            onReset={handleReset}
            resetDisabled={!resetEnabled}
          />
        }
        inputsDisabled={inputsDisabled}
        stickyHeader={
          <View style={styles.headerRow}>
            <View style={[styles.headerTextWrap, isAndroidLandscape && styles.headerTextWrapLandscape]}>
              <Text style={styles.sectionTitle}>Sequence</Text>
              <Text style={styles.hint}>
                {isAndroidLandscape
                  ? 'Use arrows to reorder'
                  : 'Long-press the ≡ icon to drag and reorder'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addBtnCompact, inputsDisabled && styles.addBtnDisabled]}
              onPress={() => setIsAddStepModalOpen(true)}
              disabled={inputsDisabled}
            >
              <Ionicons name="add-circle" size={20} color={inputsDisabled ? '#999' : '#fff'} />
              <Text style={[styles.addBtnCompactText, inputsDisabled && styles.addBtnTextDisabled]}>
                Add step
              </Text>
            </TouchableOpacity>
          </View>
        }
        useNestableScroll
        useKeyboardAvoiding
      >
        {isAndroidLandscape ? (
          <View style={styles.stepsGrid}>
            {(() => {
              const mid = Math.ceil(steps.length / 2)
              const col1 = steps.slice(0, mid)
              const col2 = steps.slice(mid)
              const renderStep = (item: CueStep, index: number) => (
                <View key={item.id} style={styles.stepCardLandscape}>
                  <View style={styles.stepRowWrapper}>
                    <View style={styles.dragHandlePlaceholder} />
                    <View style={styles.stepRowContent}>
                      <CueStepRow
                        step={item}
                        index={index}
                        total={steps.length}
                        onUpdate={(s) => updateStep(index, s)}
                        onRemove={() => removeStep(index)}
                        onDuplicate={() => duplicateStep(index)}
                        onMoveUp={() => moveStep(index, 'up')}
                        onMoveDown={() => moveStep(index, 'down')}
                        disabled={inputsDisabled}
                        inputSettings={
                          (() => {
                            const cueCraft = (profile?.settings as Record<string, unknown>)
                              ?.cueCraft as CueCraftUserSettings | undefined
                            const { inputSettings } = getFeatureInputSettings(
                              cueCraft,
                              cueCraftDefaults
                            )
                            return inputSettings as typeof cueCraftDefaults.inputSettings
                          })()
                        }
                      />
                    </View>
                  </View>
                </View>
              )
              return (
                <>
                  <View style={styles.stepsColumn}>
                    {col1.map((item, i) => renderStep(item, i))}
                  </View>
                  <View style={styles.stepsColumn}>
                    {col2.map((item, i) => renderStep(item, mid + i))}
                  </View>
                </>
              )
            })()}
          </View>
        ) : (
          <NestableDraggableFlatList
            data={steps}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => setSteps(data)}
            renderItem={({ item, drag, isActive, getIndex }) => {
              const index = getIndex() ?? 0
              return (
                <ScaleDecorator>
                  <View style={styles.stepRowWrapper}>
                    <TouchableOpacity
                      onLongPress={inputsDisabled ? undefined : drag}
                      style={styles.dragHandle}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Ionicons
                        name="menu"
                        size={24}
                        color={inputsDisabled ? '#ccc' : '#9ca3af'}
                      />
                    </TouchableOpacity>
                    <View style={styles.stepRowContent}>
                      <CueStepRow
                        step={item}
                        index={index}
                        total={steps.length}
                        onUpdate={(s) => updateStep(index, s)}
                        onRemove={() => removeStep(index)}
                        onDuplicate={() => duplicateStep(index)}
                        onMoveUp={() => moveStep(index, 'up')}
                        onMoveDown={() => moveStep(index, 'down')}
                        disabled={inputsDisabled}
                        inputSettings={
                          (() => {
                            const cueCraft = (profile?.settings as Record<string, unknown>)
                              ?.cueCraft as CueCraftUserSettings | undefined
                            const { inputSettings } = getFeatureInputSettings(
                              cueCraft,
                              cueCraftDefaults
                            )
                            return inputSettings as typeof cueCraftDefaults.inputSettings
                          })()
                        }
                      />
                    </View>
                  </View>
                </ScaleDecorator>
              )
            }}
          />
        )}
      </FeatureScreenLayout>

      <AddStepModal
        visible={isAddStepModalOpen}
        onAdd={addStep}
        onCancel={() => setIsAddStepModalOpen(false)}
        defaultValues={
          (profile?.settings as Record<string, unknown>)?.cueCraft as
            | { defaultValues?: Record<string, number> }
            | undefined
        }
      />

      <SaveFavoriteModal
        visible={isSaveModalOpen}
        onSave={saveFavorite}
        onCancel={() => setIsSaveModalOpen(false)}
        placeholder="e.g. My handstand flow"
      />

      <FavoritesModal
        visible={isFavoritesModalOpen}
        favorites={favorites}
        userId={session?.user?.id ?? ''}
        featureKey={FEATURE_KEY}
        onSelect={loadFavorite}
        onClose={() => setIsFavoritesModalOpen(false)}
        onFavoritesChanged={async () => {
          if (session?.user?.id) {
            const p = await getProfile(session.user.id)
            setProfile(p)
          }
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
    flexShrink: 0,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTextWrapLandscape: {
    paddingLeft: 8,
  },
  addBtnCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    backgroundColor: '#5B9A8B',
    borderRadius: 10,
  },
  addBtnCompactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stepsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  stepsColumn: {
    flex: 1,
    minWidth: 0,
  },
  stepCardLandscape: {
    marginBottom: 12,
  },
  dragHandlePlaceholder: {
    width: 8,
  },
  stepRowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dragHandle: {
    paddingTop: 20,
    paddingRight: 8,
  },
  stepRowContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  hint: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#5B9A8B',
    borderRadius: 12,
    marginTop: 8,
  },
  addBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
  addBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  addBtnTextDisabled: {
    color: '#9ca3af',
  },
})
