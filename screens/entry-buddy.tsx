import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useKeepAwake } from 'expo-keep-awake'
import { Ionicons } from '@expo/vector-icons'

import { TimerDisplay } from '../components/timer-display'
import { FeatureScreenLayout } from '../components/feature-screen-layout'
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
import { getProfile } from '../services/profile.service'

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
  useKeepAwake()
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

  const menuHandlersRef = useRef({
    onInfo: () => navigation.navigate('EntryBuddyInfo'),
    onSetVoice: () => navigation.navigate('VoiceSet'),
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: () => navigation.navigate('EntryBuddySettings'),
    session,
  })
  menuHandlersRef.current = {
    onInfo: () => navigation.navigate('EntryBuddyInfo'),
    onSetVoice: () => navigation.navigate('VoiceSet'),
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: () => navigation.navigate('EntryBuddySettings'),
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

  const currentSetRef = useRef(1)
  const cleanupRef = useRef<(() => void) | null>(null)
  const resetSignalRef = useRef(createResetSignal())
  const voiceRef = useRef<{ identifier: string; name: string } | null>(null)

  useFocusEffect(
    useCallback(() => {
      getVoice(session?.user?.id).then((v) => {
        voiceRef.current = v
      })
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
        setDisplayContent(`Rest ${restTime}`)
        await speak(`Rest for ${restTime} seconds`, voiceRef.current)
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
        <View style={styles.inputs}>
          <NumberInput
            label="Get ready"
            value={getReadyTime}
            onDecrease={() =>
              setGetReadyTime((v) =>
                Math.max(inputSettings.getReadyTime.min, v - inputSettings.getReadyTime.step)
              )
            }
            onIncrease={() =>
              setGetReadyTime((v) =>
                v + inputSettings.getReadyTime.step
              )
            }
            disabled={inputsDisabled}
          />
          <NumberInput
            label="Entries"
            value={numEntries}
            onDecrease={() =>
              setNumEntries((v) =>
                Math.max(inputSettings.entryCount.min, v - inputSettings.entryCount.step)
              )
            }
            onIncrease={() =>
              setNumEntries((v) =>
                v + inputSettings.entryCount.step
              )
            }
            disabled={inputsDisabled}
          />
          <NumberInput
            label="Hold time"
            value={holdTime}
            onDecrease={() =>
              setHoldTime((v) =>
                Math.max(inputSettings.holdTime.min, v - inputSettings.holdTime.step)
              )
            }
            onIncrease={() =>
              setHoldTime((v) =>
                v + inputSettings.holdTime.step
              )
            }
            disabled={inputsDisabled}
          />
          <NumberInput
            label="Time between"
            value={timeBetween}
            onDecrease={() =>
              setTimeBetween((v) =>
                Math.max(inputSettings.timeBetween.min, v - inputSettings.timeBetween.step)
              )
            }
            onIncrease={() =>
              setTimeBetween((v) =>
                v + inputSettings.timeBetween.step
              )
            }
            disabled={inputsDisabled}
          />
          <NumberInput
            label="Sets"
            value={numSets}
            onDecrease={() =>
              setNumSets((v) =>
                Math.max(inputSettings.numSets.min, v - inputSettings.numSets.step)
              )
            }
            onIncrease={() =>
              setNumSets((v) =>
                v + inputSettings.numSets.step
              )
            }
            disabled={inputsDisabled}
          />
          {numSets > 1 && (
            <View style={styles.singleInputWrapper}>
              <NumberInput
                label="Rest time"
                value={restTime}
                onDecrease={() =>
                  setRestTime((v) =>
                    Math.max(inputSettings.restTime.min, v - inputSettings.restTime.step)
                  )
                }
                onIncrease={() =>
                  setRestTime((v) =>
                    v + inputSettings.restTime.step
                  )
                }
                disabled={inputsDisabled}
              />
            </View>
          )}
        </View>
      </FeatureScreenLayout>

      <SaveFavoriteModal
        visible={isSaveModalOpen}
        onSave={saveFavorite}
        onCancel={() => setIsSaveModalOpen(false)}
        placeholder="e.g. Tuck entries"
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
  inputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    columnGap: 12,
    rowGap: 24,
  },
  singleInputWrapper: {
    alignSelf: 'flex-start',
    width: '48%',
  },
  note: { fontSize: 12, color: '#999', fontStyle: 'italic' },
})
