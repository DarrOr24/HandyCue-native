import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { Ionicons } from '@expo/vector-icons'

import { TimerDisplay } from '../components/timer-display'
import { FeatureScreenLayout } from '../components/feature-screen-layout'
import { FeatureInputsGrid } from '../components/feature-inputs-grid'
import { NumberInput } from '../components/number-input'
import { FeatureOverflowMenu } from '../components/feature-overflow-menu'
import { FeatureHeaderRight } from '../components/feature-header-right'
import { FeatureActionButtons } from '../components/feature-action-buttons'
import { SaveFavoriteModal } from '../components/Modals/SaveFavoriteModal'
import { FavoritesModal } from '../components/Modals/FavoritesModal'

import { stopSpeech, createResetSignal, speak } from '../services/core.service'
import { getVoice } from '../services/voice.service'
import {
  runGetReadyCountdown,
  runEntries,
  runRestCycle,
} from '../services/entryBuddy.service'
import { decrementFloor } from '../theme/input-styles'
import {
  entryBuddyDefaults,
  getFeatureInputSettings,
  type EntryBuddyUserSettings,
} from '../services/entryBuddy.settings.service'
import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
} from '../services/cueCoach.favorites.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile, saveInputsToProfile } from '../services/profile.service'

export type EntryBuddyInputs = {
  getReadyTime: number
  entryCount: number
  holdTime: number
  timeBetween: number
  numSets: number
  restTime: number
}

const FEATURE_KEY = 'entryBuddy'

export function EntryBuddyScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()

  const [getReadyTime, setGetReadyTime] = useState(5)
  const [numEntries, setNumEntries] = useState(5)
  const [holdTime, setHoldTime] = useState(1)
  const [timeBetween, setTimeBetween] = useState(2)
  const [numSets, setNumSets] = useState(1)
  const [restTime, setRestTime] = useState(60)

  const [inputSettings, setInputSettings] = useState(entryBuddyDefaults.inputSettings as typeof entryBuddyDefaults.inputSettings)
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)

  const favorites = getFavoritesForFeature<EntryBuddyInputs>(profile, FEATURE_KEY)

  async function saveCurrentInputsToProfile() {
    if (!session?.user?.id) return
    await saveInputsToProfile(session.user.id, FEATURE_KEY, {
      getReadyTime,
      entryCount: numEntries,
      holdTime,
      timeBetween,
      numSets,
      restTime,
    })
  }

  const menuHandlersRef = useRef({
    onInfo: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('EntryBuddyInfo')
    },
    onSetVoice: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('VoiceSet')
    },
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('EntryBuddySettings')
    },
    onExampleVideos: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('ExampleVideos', { featureKey: 'entryBuddy' })
    },
    session,
  })
  menuHandlersRef.current = {
    onInfo: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('EntryBuddyInfo')
    },
    onSetVoice: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('VoiceSet')
    },
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('EntryBuddySettings')
    },
    onExampleVideos: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('ExampleVideos', { featureKey: 'entryBuddy' })
    },
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
        setInputSettings(entryBuddyDefaults.inputSettings)
        return
      }
      getProfile(session.user.id)
        .then((p) => {
          setProfile(p)
          const userSettings = (p?.settings as Record<string, unknown>)?.entryBuddy as
            | EntryBuddyUserSettings
            | null
            | undefined
          const { inputSettings: is, defaultValues } = getFeatureInputSettings(
            userSettings,
            entryBuddyDefaults
          )
          const merged = { ...entryBuddyDefaults.inputSettings, ...is } as typeof entryBuddyDefaults.inputSettings
          setInputSettings(merged)
          const dv = defaultValues as Record<string, number>
          setGetReadyTime(dv.getReadyTime ?? entryBuddyDefaults.defaultValues.getReadyTime)
          setNumEntries(dv.entryCount ?? entryBuddyDefaults.defaultValues.entryCount)
          setHoldTime(dv.holdTime ?? entryBuddyDefaults.defaultValues.holdTime)
          setTimeBetween(dv.timeBetween ?? entryBuddyDefaults.defaultValues.timeBetween)
          setNumSets(defaultValues.numSets ?? entryBuddyDefaults.defaultValues.numSets)
          setRestTime(defaultValues.restTime ?? entryBuddyDefaults.defaultValues.restTime)
        })
        .catch(() => {
          setProfile(null)
          setInputSettings(entryBuddyDefaults.inputSettings)
        })
    }, [session?.user?.id])
  )

  const [displayContent, setDisplayContent] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'getReady' | 'entries' | 'rest' | 'done'>('idle')

  const isRunning = phase !== 'idle' && phase !== 'done'
  useEffect(() => {
    if (isRunning) {
      void activateKeepAwakeAsync()
    } else {
      void deactivateKeepAwake()
    }
    return () => {
      void deactivateKeepAwake()
    }
  }, [isRunning])

  const currentSetRef = useRef(1)
  const cleanupRef = useRef<(() => void) | null>(null)
  const resetSignalRef = useRef(createResetSignal())
  const voiceRef = useRef<{ identifier: string; name: string } | null>(null)

  useFocusEffect(
    useCallback(() => {
      getVoice(session?.user?.id).then((v) => {
        voiceRef.current = v
      })
      return () => {
        resetSignalRef.current.signal()
        clearCleanup()
        stopSpeech()
        setPhase('idle')
        setDisplayContent(null)
        currentSetRef.current = 1
      }
    }, [session?.user?.id])
  )

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current()
      stopSpeech()
    }
  }, [])

  function clearCleanup() {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }

  function handleReset() {
    resetSignalRef.current.signal()
    clearCleanup()
    stopSpeech()
    setPhase('idle')
    setDisplayContent(null)
    currentSetRef.current = 1
  }

  async function handleStart() {
    resetSignalRef.current.reset()
    voiceRef.current = await getVoice(session?.user?.id)

    setPhase('getReady')
    setDisplayContent('Ready!')

    await runGetReadyCountdown({
      getReadyTime,
      storedVoice: voiceRef.current,
      onTick: setDisplayContent,
      isCancelled: () => resetSignalRef.current.isCancelled(),
    })

    if (resetSignalRef.current.isCancelled()) return

    currentSetRef.current = 1
    await runAllSets()
  }

  async function runAllSets(startSet = 1) {
    for (let set = startSet; set <= numSets; set++) {
      if (resetSignalRef.current.isCancelled()) return
      const isFinal = set === numSets

      await runEntries({
        setNum: set,
        numSets,
        numEntries,
        holdTime,
        timeBetween,
        storedVoice: voiceRef.current,
        onDisplay: setDisplayContent,
        isCancelled: () => resetSignalRef.current.isCancelled(),
      })

      if (resetSignalRef.current.isCancelled()) return

      if (!isFinal) {
        setPhase('rest')
        setDisplayContent('Rest')
        await speak(`Set finished. Rest for ${restTime} seconds`, voiceRef.current)
        if (resetSignalRef.current.isCancelled()) return

        await new Promise<void>((resolve) => {
          cleanupRef.current = runRestCycle({
            restTime,
            storedVoice: voiceRef.current,
            onTick: (_, display) => setDisplayContent(display),
            onRestComplete: () => {
              clearCleanup()
              resolve()
            },
            isCancelled: () => resetSignalRef.current.isCancelled(),
            onCancelled: resolve,
          })
        })
        if (resetSignalRef.current.isCancelled()) return
      }
    }

    if (resetSignalRef.current.isCancelled()) return
    setPhase('done')
    setDisplayContent('Done!')
    await speak('Session over. Good job!', voiceRef.current)
    handleReset()
  }

  const isActive = phase === 'getReady' || phase === 'entries' || phase === 'rest'
  const resetEnabled = isActive || phase === 'done'
  const inputsDisabled = isActive || phase === 'done'

  function getCurrentInputs(): EntryBuddyInputs {
    return {
      getReadyTime,
      entryCount: numEntries,
      holdTime,
      timeBetween,
      numSets,
      restTime,
    }
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
    const { inputs } = fav
    setGetReadyTime(inputs.getReadyTime)
    setNumEntries(inputs.entryCount)
    setHoldTime(inputs.holdTime)
    setTimeBetween(inputs.timeBetween)
    setNumSets(inputs.numSets)
    setRestTime(inputs.restTime)
    setIsFavoritesModalOpen(false)
  }

  const primaryIcon = 'play'
  const primaryDisabled = phase === 'getReady'

  return (
    <>
      <FeatureScreenLayout
        timerContent={
          <TimerDisplay
            content={
              phase === 'done' ? (
                <Ionicons name="trophy" size={48} color="#5B9A8B" />
              ) : phase === 'idle' && !displayContent ? (
                <Ionicons name="happy-outline" size={48} color="#5B9A8B" />
              ) : (
                displayContent
              )
            }
          />
        }
        actions={
          <FeatureActionButtons
            primaryIcon={primaryIcon}
            onPrimaryPress={handleStart}
            primaryDisabled={primaryDisabled}
            onReset={handleReset}
            resetDisabled={!resetEnabled}
          />
        }
        inputsDisabled={inputsDisabled}
        footer={<Text style={styles.note}>* All time values are in seconds</Text>}
      >
        <FeatureInputsGrid>
          <FeatureInputsGrid.GridItem>
          <NumberInput
            label="Get ready"
            value={getReadyTime}
            onDecrease={() =>
              setGetReadyTime((v) =>
                Math.max(decrementFloor(inputSettings.getReadyTime.min, inputSettings.getReadyTime.step), v - inputSettings.getReadyTime.step)
              )
            }
            onIncrease={() =>
              setGetReadyTime((v) =>
                v + inputSettings.getReadyTime.step
              )
            }
            disabled={inputsDisabled}
          />
          </FeatureInputsGrid.GridItem>
          <FeatureInputsGrid.GridItem>
          <NumberInput
            label="Entries"
            value={numEntries}
            onDecrease={() =>
              setNumEntries((v) =>
                Math.max(decrementFloor(inputSettings.entryCount.min, inputSettings.entryCount.step), v - inputSettings.entryCount.step)
              )
            }
            onIncrease={() =>
              setNumEntries((v) =>
                v + inputSettings.entryCount.step
              )
            }
            disabled={inputsDisabled}
          />
          </FeatureInputsGrid.GridItem>
          <FeatureInputsGrid.GridItem>
          <NumberInput
            label="Hold time"
            value={holdTime}
            onDecrease={() =>
              setHoldTime((v) =>
                Math.max(decrementFloor(inputSettings.holdTime.min, inputSettings.holdTime.step), v - inputSettings.holdTime.step)
              )
            }
            onIncrease={() =>
              setHoldTime((v) =>
                v + inputSettings.holdTime.step
              )
            }
            disabled={inputsDisabled}
          />
          </FeatureInputsGrid.GridItem>
          <FeatureInputsGrid.GridItem>
          <NumberInput
            label="Time between"
            value={timeBetween}
            onDecrease={() =>
              setTimeBetween((v) =>
                Math.max(decrementFloor(inputSettings.timeBetween.min, inputSettings.timeBetween.step), v - inputSettings.timeBetween.step)
              )
            }
            onIncrease={() =>
              setTimeBetween((v) =>
                v + inputSettings.timeBetween.step
              )
            }
            disabled={inputsDisabled}
          />
          </FeatureInputsGrid.GridItem>
          <FeatureInputsGrid.GridItem>
          <NumberInput
            label="Sets"
            value={numSets}
            onDecrease={() =>
              setNumSets((v) =>
                Math.max(decrementFloor(inputSettings.numSets.min, inputSettings.numSets.step), v - inputSettings.numSets.step)
              )
            }
            onIncrease={() =>
              setNumSets((v) =>
                v + inputSettings.numSets.step
              )
            }
            disabled={inputsDisabled}
          />
          </FeatureInputsGrid.GridItem>
          {numSets > 1 && (
            <FeatureInputsGrid.SingleInput>
              <NumberInput
                label="Rest time"
                value={restTime}
                onDecrease={() =>
                  setRestTime((v) =>
                    Math.max(decrementFloor(inputSettings.restTime.min, inputSettings.restTime.step), v - inputSettings.restTime.step)
                  )
                }
                onIncrease={() =>
                  setRestTime((v) =>
                    v + inputSettings.restTime.step
                  )
                }
                disabled={inputsDisabled}
              />
            </FeatureInputsGrid.SingleInput>
          )}
        </FeatureInputsGrid>
      </FeatureScreenLayout>

      <SaveFavoriteModal
        visible={isSaveModalOpen}
        onSave={saveFavorite}
        onCancel={() => setIsSaveModalOpen(false)}
        placeholder="e.g. Kneeling tuck entries"
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
  note: { fontSize: 12, color: '#999', fontStyle: 'italic' },
})
