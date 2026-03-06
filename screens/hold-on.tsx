import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useKeepAwake } from 'expo-keep-awake'

import { TimerDisplay } from '../components/timer-display'
import { ActionButton } from '../components/action-button'
import { FeatureScreenLayout } from '../components/feature-screen-layout'
import { NumberInput } from '../components/number-input'
import {
  stopSpeech,
  createResetSignal,
  getStoredVoice,
  speak,
} from '../services/core.service'
import {
  runGetReadyCountdown,
  runHoldInterval,
  runRestCycle,
} from '../services/holdOn.service'
import {
  holdOnDefaults,
  getFeatureInputSettings,
  type HoldOnUserSettings,
} from '../services/holdOn.settings.service'
import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
  type HoldOnInputs,
} from '../services/holdOn.favorites.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile } from '../services/profile.service'
import { OverflowMenu } from '../components/overflow-menu'
import { SaveFavoriteModal } from '../components/Modals/SaveFavoriteModal'
import { FavoritesModal } from '../components/Modals/FavoritesModal'

const DEFAULT_HOLD = 60
const DEFAULT_GET_READY = 5
const DEFAULT_SETS = 1
const DEFAULT_REST = 60
const DEFAULT_CALLOUT_STEP = 10

const FEATURE_KEY = 'holdOn'

export function HoldOnScreen() {
  useKeepAwake()
  const navigation = useNavigation<any>()
  const { session } = useAuth()

  const [holdTime, setHoldTime] = useState(DEFAULT_HOLD)
  const [getReadyTime, setGetReadyTime] = useState(DEFAULT_GET_READY)
  const [numSets, setNumSets] = useState(DEFAULT_SETS)
  const [restTime, setRestTime] = useState(DEFAULT_REST)
  const [calloutStep, setCalloutStep] = useState(DEFAULT_CALLOUT_STEP)

  const [inputSettings, setInputSettings] = useState(holdOnDefaults.inputSettings)

  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)

  const favorites = getFavoritesForFeature(profile, FEATURE_KEY)

  const menuHandlersRef = useRef({
    setIsSaveModalOpen,
    setIsFavoritesModalOpen,
    session,
  })
  menuHandlersRef.current = {
    setIsSaveModalOpen,
    setIsFavoritesModalOpen,
    session,
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <OverflowMenu
          items={[
            {
              icon: 'information-circle-outline',
              label: 'Info',
              onPress: () => navigation.navigate('HoldOnInfo'),
            },
            {
              icon: 'mic-outline',
              label: 'Set voice',
              onPress: () => navigation.navigate('VoiceSet'),
            },
            {
              icon: 'heart-outline',
              label: 'Favorites',
              onPress: () => {
                const { session: s, setIsFavoritesModalOpen: open } = menuHandlersRef.current
                if (!s?.user?.id) {
                  Alert.alert('Log in required', 'Please log in to view your favorites.')
                  return
                }
                requestAnimationFrame(() => open(true))
              },
            },
            {
              icon: 'bookmark-outline',
              label: 'Save',
              onPress: () => {
                const { session: s, setIsSaveModalOpen: open } = menuHandlersRef.current
                if (!s?.user?.id) {
                  Alert.alert('Log in required', 'Please log in to save favorites.')
                  return
                }
                requestAnimationFrame(() => open(true))
              },
            },
            {
              icon: 'settings-outline',
              label: 'Settings',
              onPress: () => navigation.navigate('HoldOnSettings'),
            },
          ]}
        />
      ),
    })
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      if (!session?.user?.id) {
        setProfile(null)
        setInputSettings(holdOnDefaults.inputSettings)
        return
      }
      getProfile(session.user.id)
        .then((p) => {
          setProfile(p)
          const userSettings = (p?.settings as Record<string, unknown>)?.holdOn as
            | HoldOnUserSettings
            | null
            | undefined
          const { inputSettings: is, defaultValues } = getFeatureInputSettings(
            userSettings,
            holdOnDefaults
          )
          const mergedInputSettings = {
            ...holdOnDefaults.inputSettings,
            ...is,
          } as typeof holdOnDefaults.inputSettings
          setInputSettings(mergedInputSettings)
          setHoldTime(defaultValues.holdTime ?? holdOnDefaults.defaultValues.holdTime)
          setGetReadyTime(defaultValues.getReadyTime ?? holdOnDefaults.defaultValues.getReadyTime)
          setNumSets(defaultValues.numSets ?? holdOnDefaults.defaultValues.numSets)
          setRestTime(defaultValues.restTime ?? holdOnDefaults.defaultValues.restTime)
          const ht = defaultValues.holdTime ?? holdOnDefaults.defaultValues.holdTime
          setCalloutStep(Math.max(5, Math.min(10, Math.floor(ht / 2))))
        })
        .catch(() => {
          setProfile(null)
          setInputSettings(holdOnDefaults.inputSettings)
        })
    }, [session?.user?.id])
  )

  const [displayContent, setDisplayContent] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'getReady' | 'hold' | 'rest' | 'done'>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const currentSetRef = useRef(1)
  const cleanupRef = useRef<(() => void) | null>(null)
  const resetSignalRef = useRef(createResetSignal())
  const numSetsRef = useRef(numSets)
  const voiceRef = useRef<{ identifier: string; name: string } | null>(null)

  numSetsRef.current = numSets

  useFocusEffect(
    useCallback(() => {
      getStoredVoice().then((v) => {
        voiceRef.current = v
      })
    }, [])
  )

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current()
      stopSpeech()
    }
  }, [])

  useEffect(() => {
    const max = Math.floor(holdTime / 2)
    if (calloutStep > max && max >= 5) setCalloutStep(max)
  }, [holdTime])

  function clearIntervalRef() {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }

  function handleReset() {
    resetSignalRef.current.signal()
    clearIntervalRef()
    stopSpeech()
    setPhase('idle')
    setDisplayContent(null)
    setElapsed(0)
    setIsPaused(false)
    currentSetRef.current = 1
  }

  async function handleStart() {
    resetSignalRef.current.reset()
    voiceRef.current = await getStoredVoice()

    if (phase === 'done') {
      clearIntervalRef()
      stopSpeech()
    }

    setPhase('getReady')
    setDisplayContent('Ready!')

    await runGetReadyCountdown({
      getReadyTime,
      storedVoice: voiceRef.current,
      onTick: setDisplayContent,
      isCancelled: () => resetSignalRef.current.isCancelled(),
    })

    if (resetSignalRef.current.isCancelled()) return

    setPhase('hold')
    setDisplayContent('0:00')
    setElapsed(0)
    currentSetRef.current = 1

    const msg =
      numSets > 1
        ? `Round 1: Hold for ${holdTime} seconds`
        : `Hold for ${holdTime} seconds`

    await speak(msg, voiceRef.current)
    if (resetSignalRef.current.isCancelled()) return

    startHoldInterval()
  }

  function startHoldInterval(startAt = 0) {
    if (resetSignalRef.current.isCancelled()) return

    cleanupRef.current = runHoldInterval({
      holdTime,
      calloutStep,
      storedVoice: voiceRef.current,
      startAt,
      onTick: (e, display) => {
        setElapsed(e)
        setDisplayContent(display)
      },
      onHoldComplete: () => {
        if (resetSignalRef.current.isCancelled()) return
        const isFinal = currentSetRef.current >= numSetsRef.current
        if (isFinal) {
          setPhase('done')
          setDisplayContent('Done!')
          speak('Session over. Good job!', voiceRef.current)
        } else {
          startRestCycle()
        }
      },
      isCancelled: () => resetSignalRef.current.isCancelled(),
    })
  }

  function startRestCycle() {
    if (resetSignalRef.current.isCancelled()) return

    setPhase('rest')
    setDisplayContent(`Rest ${restTime}`)
    speak(`Rest for ${restTime} seconds`, voiceRef.current)

    cleanupRef.current = runRestCycle({
      restTime,
      storedVoice: voiceRef.current,
      onTick: (_, display) => setDisplayContent(display),
      onRestComplete: () => {
        if (resetSignalRef.current.isCancelled()) return
        currentSetRef.current += 1
        const nextSet = currentSetRef.current
        const isFinal = nextSet >= numSetsRef.current

        setPhase('hold')
        setElapsed(0)
        setDisplayContent('0:00')

        const msg = isFinal
          ? `Final round: Hold for ${holdTime} seconds`
          : `Round ${nextSet}: Hold for ${holdTime} seconds`

        speak(msg, voiceRef.current)
        startHoldInterval()
      },
      isCancelled: () => resetSignalRef.current.isCancelled(),
    })
  }

  function handlePause() {
    clearIntervalRef()
    stopSpeech()
    setIsPaused(true)
  }

  function handleResume() {
    setIsPaused(false)
    if (phase === 'hold') startHoldInterval(elapsed)
  }

  const isActive = phase === 'getReady' || phase === 'hold' || phase === 'rest'
  const resetEnabled = isActive || phase === 'done'
  const inputsDisabled = isActive || phase === 'done'

  const showPause = (phase === 'hold' || phase === 'rest') && !isPaused
  const showStart = phase === 'idle' || phase === 'done'
  const startPlayDisabled = phase === 'getReady'
  const startPlayIcon = phase === 'getReady' || showPause ? 'pause' : 'play'

  const onStartPlayPress = showStart ? handleStart : showPause ? handlePause : handleResume

  function getCurrentInputs(): HoldOnInputs {
    return {
      getReadyTime,
      holdTime,
      numSets,
      restTime,
      calloutStep,
    }
  }

  function saveFavorite(name: string) {
    const trimmed = name.trim()
    const isDuplicate = checkIsDuplicateName(trimmed, favorites)
    if (isDuplicate) {
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
    const { getReadyTime: gr, holdTime: ht, numSets: ns, restTime: rt, calloutStep: cs = 10 } = fav.inputs
    setGetReadyTime(gr)
    setHoldTime(ht)
    setNumSets(ns)
    setRestTime(rt)
    setCalloutStep(Math.max(5, Math.min(10, Math.floor(ht / 2), cs)))
    setIsFavoritesModalOpen(false)
  }

  return (
    <>
    <FeatureScreenLayout
      timerContent={<TimerDisplay content={displayContent} />}
      actions={
        <>
          <ActionButton
            icon={startPlayIcon}
            onPress={onStartPlayPress}
            disabled={startPlayDisabled}
            variant="primary"
          />
          <ActionButton
            icon="refresh"
            onPress={handleReset}
            disabled={!resetEnabled}
            variant="danger"
          />
        </>
      }
      inputsDisabled={inputsDisabled}
      footer={<Text style={styles.note}>* All time values are in seconds</Text>}
    >
      <View style={styles.inputs}>
        <NumberInput
          label="Hold time"
          value={holdTime}
          onDecrease={() =>
            setHoldTime((v) => Math.max(inputSettings.holdTime.min, v - inputSettings.holdTime.step))
          }
          onIncrease={() =>
            setHoldTime((v) => Math.min(inputSettings.holdTime.max, v + inputSettings.holdTime.step))
          }
          disabled={inputsDisabled}
        />
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
              Math.min(inputSettings.getReadyTime.max, v + inputSettings.getReadyTime.step)
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
              Math.min(inputSettings.numSets.max, v + inputSettings.numSets.step)
            )
          }
          disabled={inputsDisabled}
        />
        {numSets > 1 && (
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
                Math.min(inputSettings.restTime.max, v + inputSettings.restTime.step)
              )
            }
            disabled={inputsDisabled}
          />
        )}
        {holdTime >= 10 && (
          <NumberInput
            label="Callout step"
            value={calloutStep}
            onDecrease={() => setCalloutStep((v) => Math.max(5, v - 5))}
            onIncrease={() =>
              setCalloutStep((v) => Math.min(Math.floor(holdTime / 2), v + 5))
            }
            disabled={inputsDisabled}
          />
        )}
      </View>
    </FeatureScreenLayout>

    <SaveFavoriteModal
      visible={isSaveModalOpen}
      onSave={saveFavorite}
      onCancel={() => setIsSaveModalOpen(false)}
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
  note: { fontSize: 12, color: '#999', fontStyle: 'italic' },
})
