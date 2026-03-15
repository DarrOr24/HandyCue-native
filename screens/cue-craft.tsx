import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
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

import { stopSpeech, createResetSignal, speak } from '../services/core.service'
import { getVoice } from '../services/voice.service'
import { runCueSequence } from '../services/cueCraft.service'
import {
  getDefaultSteps,
  cueCraftDefaults,
  getFeatureInputSettings,
} from '../services/cueCraft.settings.service'
import type { CueCraftUserSettings } from '../services/cueCraft.settings.service'
import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
} from '../services/cueCraft.favorites.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile } from '../services/profile.service'
import type { CueStep } from '../services/cueCraft.types'

const FEATURE_KEY = 'cueCraft'

export function CueCraftScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()

  const [steps, setSteps] = useState<CueStep[]>(getDefaultSteps())
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)
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
            | CueCraftUserSettings
            | undefined
          setSteps(getDefaultSteps(cueCraft))
        })
        .catch(() => {
          setProfile(null)
          setSteps(getDefaultSteps())
        })
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
      next[index] = step
      return next
    })
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index))
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
    setSteps(fav.inputs.steps ?? [])
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
        useNestableScroll
      >
        <Text style={styles.sectionTitle}>Sequence</Text>
        <Text style={styles.hint}>Long-press the ≡ icon to drag and reorder</Text>

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

        <TouchableOpacity
          style={[styles.addBtn, inputsDisabled && styles.addBtnDisabled]}
          onPress={() => setIsAddStepModalOpen(true)}
          disabled={inputsDisabled}
        >
          <Ionicons name="add-circle" size={26} color={inputsDisabled ? '#999' : '#fff'} />
          <Text style={[styles.addBtnText, inputsDisabled && styles.addBtnTextDisabled]}>
            Add step
          </Text>
        </TouchableOpacity>
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
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
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
