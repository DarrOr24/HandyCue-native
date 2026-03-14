import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { Ionicons } from '@expo/vector-icons'

import { TimerDisplay } from '../components/timer-display'
import { FeatureScreenLayout } from '../components/feature-screen-layout'
import { FeatureInputsGrid } from '../components/feature-inputs-grid'
import { FeatureOverflowMenu } from '../components/feature-overflow-menu'
import { FeatureHeaderRight } from '../components/feature-header-right'
import { FeatureActionButtons } from '../components/feature-action-buttons'
import { NumberInput } from '../components/number-input'
import { SelectInput, type SelectOption } from '../components/select-input'

import { stopSpeech, createResetSignal, speak } from '../services/core.service'
import { getVoice } from '../services/voice.service'
import {
  runGetReadyCountdown,
  runRestCycle,
  performPhase,
  runCallout,
  type CalloutConfig,
} from '../services/drillDJ.service'
import {
  drillDJDefaults,
  getFeatureInputSettings,
  type DrillDJUserSettings,
} from '../services/drillDJ.settings.service'
import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
  type DrillDJInputs,
} from '../services/drillDJ.favorites.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile } from '../services/profile.service'
import { SaveFavoriteModal } from '../components/Modals/SaveFavoriteModal'
import { FavoritesModal } from '../components/Modals/FavoritesModal'
import { CalloutBlock } from '../components/callout-block'

const FEATURE_KEY = 'drillDJ'

type DrillType = 'slide' | 'float' | 'switch'

const DRILL_OPTIONS: SelectOption[] = [
  { value: 'slide', label: 'Slide' },
  { value: 'float', label: 'Float' },
  { value: 'switch', label: 'Switch' },
]

export function DrillDJScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()

  const [getReadyTime, setGetReadyTime] = useState<number>(drillDJDefaults.defaultValues.getReadyTime)
  const [numReps, setNumReps] = useState<number>(drillDJDefaults.defaultValues.numReps)
  const [numSets, setNumSets] = useState<number>(drillDJDefaults.defaultValues.numSets)
  const [restTime, setRestTime] = useState<number>(drillDJDefaults.defaultValues.restTime)
  const [drillType, setDrillType] = useState<DrillType>('slide')
  const [sayRepCount, setSayRepCount] = useState(true)
  const [metronomeEnabled, setMetronomeEnabled] = useState(true)

  // Slide
  const [slideDownTime, setSlideDownTime] = useState<number>(drillDJDefaults.defaultValues.slideDownTime)
  const [slideUpTime, setSlideUpTime] = useState<number>(drillDJDefaults.defaultValues.slideUpTime)
  const [holdTime, setHoldTime] = useState<number>(drillDJDefaults.defaultValues.holdTime)
  const [slideCallout, setSlideCallout] = useState<CalloutConfig>({
    type: 'none',
    afterReps: 3,
    nested: { type: 'none', afterReps: 3 },
  })
  // Float
  const [floatTime, setFloatTime] = useState<number>(drillDJDefaults.defaultValues.floatTime)
  const [timeBetweenFloats, setTimeBetweenFloats] = useState<number>(drillDJDefaults.defaultValues.timeBetweenFloats)
  const [floatCallout, setFloatCallout] = useState<CalloutConfig>({
    type: 'none',
    afterReps: 3,
    nested: { type: 'none', afterReps: 3 },
  })
  // Switch
  const [switchTime, setSwitchTime] = useState<number>(drillDJDefaults.defaultValues.switchTime)
  const [timeBetweenSwitches, setTimeBetweenSwitches] = useState<number>(drillDJDefaults.defaultValues.timeBetweenSwitches)

  const [inputSettings, setInputSettings] = useState(
    drillDJDefaults.inputSettings as typeof drillDJDefaults.inputSettings
  )
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)

  const [displayContent, setDisplayContent] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'getReady' | 'drill' | 'rest' | 'done'>('idle')

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

  const resetSignalRef = useRef(createResetSignal())
  const voiceRef = useRef<{ identifier: string; name: string } | null>(null)
  const currentSetRef = useRef(1)

  const favorites = getFavoritesForFeature<DrillDJInputs>(profile, FEATURE_KEY)

  async function saveCurrentInputsToProfile() {
    if (!session?.user?.id) return
    try {
      const p = await getProfile(session.user.id)
      const current = (p?.settings as Record<string, unknown>) ?? {}
      const existing = (current.drillDJ as DrillDJUserSettings) ?? {}
      await upsertProfile(session.user.id, {
        settings: {
          ...current,
          drillDJ: {
            ...existing,
            defaultValues: {
              ...(existing.defaultValues ?? {}),
              getReadyTime,
              numReps,
              numSets,
              restTime,
              slideDownTime,
              slideUpTime,
              holdTime,
              floatTime,
              timeBetweenFloats,
              switchTime,
              timeBetweenSwitches,
              slideCallout,
              floatCallout,
            },
          },
        },
      })
    } catch {
      // ignore
    }
  }

  const menuHandlersRef = useRef({
    onInfo: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('DrillDJInfo')
    },
    onSetVoice: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('VoiceSet')
    },
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('DrillDJSettings')
    },
    onExampleVideos: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('ExampleVideos', { featureKey: 'drillDJ' })
    },
    session,
  })
  menuHandlersRef.current = {
    onInfo: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('DrillDJInfo')
    },
    onSetVoice: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('VoiceSet')
    },
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('DrillDJSettings')
    },
    onExampleVideos: async () => {
      await saveCurrentInputsToProfile()
      navigation.navigate('ExampleVideos', { featureKey: 'drillDJ' })
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
        setInputSettings(drillDJDefaults.inputSettings)
        return
      }
      getProfile(session.user.id)
        .then((p) => {
          setProfile(p)
          const userSettings = (p?.settings as Record<string, unknown>)?.drillDJ as
            | DrillDJUserSettings
            | null
            | undefined
          const { inputSettings: is, defaultValues } = getFeatureInputSettings(
            userSettings,
            drillDJDefaults
          )
          const merged = { ...drillDJDefaults.inputSettings, ...is } as Record<string, { min: number; step: number }>
          if (merged.slideTime && !merged.slideDownTime) {
            merged.slideDownTime = merged.slideTime
            merged.slideUpTime = merged.slideTime
          }
          if (merged.timeBetweenSlides && !merged.holdTime) {
            merged.holdTime = merged.timeBetweenSlides
          }
          setInputSettings(merged as typeof drillDJDefaults.inputSettings)
          const dv = defaultValues as Record<string, number>
          setGetReadyTime((dv.getReadyTime as number) ?? drillDJDefaults.defaultValues.getReadyTime)
          setNumReps((dv.numReps as number) ?? drillDJDefaults.defaultValues.numReps)
          setNumSets((dv.numSets as number) ?? drillDJDefaults.defaultValues.numSets)
          setRestTime((dv.restTime as number) ?? drillDJDefaults.defaultValues.restTime)
          setSlideDownTime(
            (dv.slideDownTime as number) ?? (dv.slideTime as number) ?? drillDJDefaults.defaultValues.slideDownTime
          )
          setSlideUpTime(
            (dv.slideUpTime as number) ?? (dv.slideTime as number) ?? drillDJDefaults.defaultValues.slideUpTime
          )
          setHoldTime(
            (dv.holdTime as number) ?? (dv.timeBetweenSlides as number) ?? drillDJDefaults.defaultValues.holdTime
          )
          if (dv.slideCallout) setSlideCallout(dv.slideCallout as CalloutConfig)
          setFloatTime((dv.floatTime as number) ?? drillDJDefaults.defaultValues.floatTime)
          setTimeBetweenFloats((dv.timeBetweenFloats as number) ?? drillDJDefaults.defaultValues.timeBetweenFloats)
          if (dv.floatCallout) setFloatCallout(dv.floatCallout as CalloutConfig)
          setSwitchTime((dv.switchTime as number) ?? drillDJDefaults.defaultValues.switchTime)
          setTimeBetweenSwitches((dv.timeBetweenSwitches as number) ?? drillDJDefaults.defaultValues.timeBetweenSwitches)
        })
        .catch(() => {
          setProfile(null)
          setInputSettings(drillDJDefaults.inputSettings)
        })
    }, [session?.user?.id])
  )

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
    return () => {
      stopSpeech()
    }
  }, [])

  const inputsDisabled = phase !== 'idle' && phase !== 'done'
  const sessionDone = phase === 'done'

  async function runDrillSets() {
    const numSetsVal = numSets
    const drillNameMap = { slide: 'Slide Drill', float: 'Float Drill', switch: 'Switch Drill' }
    const displayMap = { slide: 'Slide', float: 'Float', switch: 'Switch' }

    for (let set = 1; set <= numSetsVal; set++) {
      if (resetSignalRef.current.isCancelled()) return
      const isFinal = set === numSetsVal

      if (numSetsVal === 1) {
        setDisplayContent(displayMap[drillType])
        await speak(drillNameMap[drillType], voiceRef.current)
      } else {
        const ordinals = ['st', 'nd', 'rd']
        const suffix = ordinals[set - 1] ?? 'th'
        const label = isFinal
          ? `Final Set: ${drillNameMap[drillType]}`
          : `${set}${suffix} Set: ${drillNameMap[drillType]}`
        setDisplayContent(displayMap[drillType])
        await speak(label, voiceRef.current)
      }
      if (resetSignalRef.current.isCancelled()) return

      await runDrill()
      if (resetSignalRef.current.isCancelled()) return

      if (!isFinal) {
        setDisplayContent('Rest')
        await speak(`Set finished. Rest for ${restTime} seconds`, voiceRef.current)
        if (resetSignalRef.current.isCancelled()) return
        await new Promise<void>((resolve) => {
          runRestCycle({
            restTime,
            storedVoice: voiceRef.current,
            onTick: (_, display) => setDisplayContent(display),
            onRestComplete: resolve,
            isCancelled: () => resetSignalRef.current.isCancelled(),
            onCancelled: resolve,
          })
        })
      }
    }

    if (resetSignalRef.current.isCancelled()) return
    setPhase('done')
    setDisplayContent('')
    await speak('Session over. Good job!', voiceRef.current)
  }

  async function runDrill() {
    const runPhase = (opts: {
      label: string
      displayLabel: string
      duration: number
    }) =>
      performPhase({
        ...opts,
        setDisplayStep: setDisplayContent,
        voice: voiceRef.current,
        enableMetronome: metronomeEnabled,
        onTick: opts.duration >= 5 ? (_, display) => setDisplayContent(display) : undefined,
        isCancelled: () => resetSignalRef.current.isCancelled(),
      })

    if (sayRepCount) {
      await speak(`${numReps} ${numReps === 1 ? 'rep' : 'reps'}`, voiceRef.current)
      if (resetSignalRef.current.isCancelled()) return
    }

    if (drillType === 'slide') {
      const runSlideReps = async (repCount: number) => {
        for (let i = 1; i <= repCount; i++) {
          if (resetSignalRef.current.isCancelled()) return
          await runPhase({
            label: 'Slide down',
            displayLabel: `Down ${i}`,
            duration: slideDownTime,
          })
          if (resetSignalRef.current.isCancelled()) return
          await runPhase({
            label: 'Hold',
            displayLabel: `Hold ${i}`,
            duration: holdTime,
          })
          if (resetSignalRef.current.isCancelled()) return
          await runPhase({
            label: 'Slide up',
            displayLabel: `Up ${i}`,
            duration: slideUpTime,
          })
        }
      }
      await runSlideReps(numReps)
      if (resetSignalRef.current.isCancelled()) return
      if (slideCallout.type !== 'none') {
        await runCallout(
          slideCallout,
          runSlideReps,
          setDisplayContent,
          voiceRef.current,
          () => resetSignalRef.current.isCancelled(),
          sayRepCount
        )
      }
    } else if (drillType === 'float') {
      const runFloatReps = async (repCount: number) => {
        for (let i = 1; i <= repCount; i++) {
          if (resetSignalRef.current.isCancelled()) return
          await runPhase({
            label: 'Float',
            displayLabel: `Float ${i}`,
            duration: floatTime,
          })
          if (resetSignalRef.current.isCancelled()) return
          setDisplayContent('Return')
          await speak('Return', voiceRef.current)
          if (resetSignalRef.current.isCancelled()) return
          await new Promise((r) => setTimeout(r, timeBetweenFloats * 1000))
        }
      }
      await runFloatReps(numReps)
      if (resetSignalRef.current.isCancelled()) return
      if (floatCallout.type !== 'none') {
        await runCallout(
          floatCallout,
          runFloatReps,
          setDisplayContent,
          voiceRef.current,
          () => resetSignalRef.current.isCancelled(),
          sayRepCount
        )
      }
    } else {
      for (let i = 1; i <= numReps; i++) {
        if (resetSignalRef.current.isCancelled()) return
        await runPhase({
          label: 'Hold',
          displayLabel: 'Hold',
          duration: timeBetweenSwitches,
        })
        if (resetSignalRef.current.isCancelled()) return
        await runPhase({
          label: 'Switch',
          displayLabel: `Switch ${i}`,
          duration: switchTime,
        })
      }
    }
  }

  async function handleStart() {
    if (inputsDisabled) return
    resetSignalRef.current.reset()
    voiceRef.current = await getVoice(session?.user?.id)

    if (phase === 'done') {
      setPhase('idle')
      setDisplayContent(null)
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

    setPhase('drill')
    setDisplayContent('')
    currentSetRef.current = 1

    runDrillSets()
  }

  function handleReset() {
    resetSignalRef.current.signal()
    stopSpeech()
    setPhase('idle')
    setDisplayContent(null)
  }

  function getCurrentInputs(): DrillDJInputs {
    return {
      getReadyTime,
      numReps,
      numSets,
      restTime,
      drillType,
      slideDownTime,
      slideUpTime,
      holdTime,
      slideCallout,
      floatTime,
      timeBetweenFloats,
      floatCallout,
      switchTime,
      timeBetweenSwitches,
      sayRepCount,
      metronomeEnabled,
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
    const inp = fav.inputs
    setGetReadyTime(inp.getReadyTime)
    setNumReps(inp.numReps)
    setNumSets(inp.numSets)
    setRestTime(inp.restTime)
    setDrillType(inp.drillType ?? 'slide')
    if (inp.slideDownTime != null) setSlideDownTime(inp.slideDownTime)
    else if (inp.slideTime != null) setSlideDownTime(inp.slideTime)
    if (inp.slideUpTime != null) setSlideUpTime(inp.slideUpTime)
    else if (inp.slideTime != null) setSlideUpTime(inp.slideTime)
    if (inp.holdTime != null) setHoldTime(inp.holdTime)
    else if (inp.timeBetweenSlides != null) setHoldTime(inp.timeBetweenSlides)
    if (inp.slideCallout) setSlideCallout(inp.slideCallout)
    if (inp.floatTime != null) setFloatTime(inp.floatTime)
    if (inp.timeBetweenFloats != null) setTimeBetweenFloats(inp.timeBetweenFloats)
    if (inp.floatCallout) setFloatCallout(inp.floatCallout)
    if (inp.switchTime != null) setSwitchTime(inp.switchTime)
    if (inp.timeBetweenSwitches != null) setTimeBetweenSwitches(inp.timeBetweenSwitches)
    if (inp.sayRepCount != null) setSayRepCount(inp.sayRepCount)
    if (inp.metronomeEnabled != null) setMetronomeEnabled(inp.metronomeEnabled)
    setIsFavoritesModalOpen(false)
  }

  const timerContent =
    phase === 'done' ? (
      <TimerDisplay content={<Ionicons name="trophy" size={48} color="#5B9A8B" />} />
    ) : phase === 'idle' && !displayContent ? (
      <TimerDisplay content={<Ionicons name="musical-notes-outline" size={48} color="#5B9A8B" />} />
    ) : (
      <TimerDisplay content={displayContent} />
    )

  return (
    <>
      <View style={styles.screenWrapper}>
        <FeatureScreenLayout
          timerContent={timerContent}
          actions={
            <FeatureActionButtons
              primaryIcon="play"
              onPrimaryPress={handleStart}
              primaryDisabled={inputsDisabled}
              onReset={handleReset}
              resetDisabled={!sessionDone && phase === 'idle'}
            />
          }
          inputsDisabled={inputsDisabled}
          footer={<Text style={styles.note}>* All time values are in seconds</Text>}
        >
          <FeatureInputsGrid>
            <FeatureInputsGrid.GridItem>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, inputsDisabled && styles.toggleLabelDisabled]}>
                Say reps
              </Text>
              <View style={Platform.OS === 'ios' ? styles.switchWrapperIOS : undefined}>
                <Switch
                  value={sayRepCount}
                  onValueChange={setSayRepCount}
                  disabled={inputsDisabled}
                  trackColor={{ false: '#d1d5db', true: '#5B9A8B' }}
                  thumbColor="#fff"
                  style={Platform.OS === 'ios' ? styles.switchIOS : undefined}
                />
              </View>
            </View>
            </FeatureInputsGrid.GridItem>
            <FeatureInputsGrid.GridItem>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, inputsDisabled && styles.toggleLabelDisabled]}>
                Voice count
              </Text>
              <View style={Platform.OS === 'ios' ? styles.switchWrapperIOS : undefined}>
                <Switch
                  value={metronomeEnabled}
                  onValueChange={setMetronomeEnabled}
                  disabled={inputsDisabled}
                  trackColor={{ false: '#d1d5db', true: '#5B9A8B' }}
                  thumbColor="#fff"
                  style={Platform.OS === 'ios' ? styles.switchIOS : undefined}
                />
              </View>
            </View>
            </FeatureInputsGrid.GridItem>
            <FeatureInputsGrid.GridItem>
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
            </FeatureInputsGrid.GridItem>
            <FeatureInputsGrid.GridItem>
            <NumberInput
              label="Reps"
              value={numReps}
              onDecrease={() =>
                setNumReps((v) =>
                  Math.max(inputSettings.numReps.min, v - inputSettings.numReps.step)
                )
              }
              onIncrease={() =>
                setNumReps((v) =>
                  v + inputSettings.numReps.step
                )
              }
              disabled={inputsDisabled}
            />
            </FeatureInputsGrid.GridItem>

            <FeatureInputsGrid.GridItem>
            <SelectInput
              label="Drill type"
              options={DRILL_OPTIONS}
              value={drillType}
              onChange={(v) => setDrillType(v as DrillType)}
              disabled={inputsDisabled}
            />
            </FeatureInputsGrid.GridItem>

            {drillType === 'slide' && (
              <>
                <FeatureInputsGrid.GridItem>
                <NumberInput
                  label="Slide down"
                  value={slideDownTime}
                  onDecrease={() =>
                    setSlideDownTime((v) =>
                      Math.max(inputSettings.slideDownTime.min, v - inputSettings.slideDownTime.step)
                    )
                  }
                  onIncrease={() =>
                    setSlideDownTime((v) =>
                      v + inputSettings.slideDownTime.step
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
                </FeatureInputsGrid.GridItem>
                <FeatureInputsGrid.GridItem>
                <NumberInput
                  label="Slide up"
                  value={slideUpTime}
                  onDecrease={() =>
                    setSlideUpTime((v) =>
                      Math.max(inputSettings.slideUpTime.min, v - inputSettings.slideUpTime.step)
                    )
                  }
                  onIncrease={() =>
                    setSlideUpTime((v) =>
                      v + inputSettings.slideUpTime.step
                    )
                  }
                  disabled={inputsDisabled}
                />
                </FeatureInputsGrid.GridItem>
                <CalloutBlock
                  callout={slideCallout}
                  onChange={setSlideCallout}
                  disabled={inputsDisabled}
                  numRepsMin={inputSettings.numReps.min}
                  numRepsStep={inputSettings.numReps.step}
                  asGridItems
                  GridItem={FeatureInputsGrid.GridItem}
                />
              </>
            )}

            {drillType === 'float' && (
              <>
                <FeatureInputsGrid.GridItem>
                <NumberInput
                  label="Float time"
                  value={floatTime}
                  onDecrease={() =>
                    setFloatTime((v) =>
                      Math.max(inputSettings.floatTime.min, v - inputSettings.floatTime.step)
                    )
                  }
                  onIncrease={() =>
                    setFloatTime((v) =>
                      v + inputSettings.floatTime.step
                    )
                  }
                  disabled={inputsDisabled}
                />
                </FeatureInputsGrid.GridItem>
                <FeatureInputsGrid.GridItem>
                <NumberInput
                  label="Time between"
                  value={timeBetweenFloats}
                  onDecrease={() =>
                    setTimeBetweenFloats((v) =>
                      Math.max(inputSettings.timeBetweenFloats.min, v - inputSettings.timeBetweenFloats.step)
                    )
                  }
                  onIncrease={() =>
                    setTimeBetweenFloats((v) =>
                      v + inputSettings.timeBetweenFloats.step
                    )
                  }
                  disabled={inputsDisabled}
                />
                </FeatureInputsGrid.GridItem>
                <CalloutBlock
                  callout={floatCallout}
                  onChange={setFloatCallout}
                  disabled={inputsDisabled}
                  numRepsMin={inputSettings.numReps.min}
                  numRepsStep={inputSettings.numReps.step}
                  asGridItems
                  GridItem={FeatureInputsGrid.GridItem}
                />
              </>
            )}

            {drillType === 'switch' && (
              <>
                <FeatureInputsGrid.GridItem>
                <NumberInput
                  label="Time between"
                  value={timeBetweenSwitches}
                  onDecrease={() =>
                    setTimeBetweenSwitches((v) =>
                      Math.max(inputSettings.timeBetweenSwitches.min, v - inputSettings.timeBetweenSwitches.step)
                    )
                  }
                  onIncrease={() =>
                    setTimeBetweenSwitches((v) =>
                      v + inputSettings.timeBetweenSwitches.step
                    )
                  }
                  disabled={inputsDisabled}
                />
                </FeatureInputsGrid.GridItem>
                <FeatureInputsGrid.GridItem>
                <NumberInput
                  label="Switch time"
                    value={switchTime}
                  onDecrease={() =>
                    setSwitchTime((v) =>
                      Math.max(inputSettings.switchTime.min, v - inputSettings.switchTime.step)
                    )
                  }
                  onIncrease={() =>
                    setSwitchTime((v) =>
                      v + inputSettings.switchTime.step
                    )
                  }
                  disabled={inputsDisabled}
                />
                </FeatureInputsGrid.GridItem>
              </>
            )}

            <FeatureInputsGrid.GridItem>
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
            </FeatureInputsGrid.GridItem>
            {numSets > 1 && (
              <FeatureInputsGrid.SingleInput>
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
              </FeatureInputsGrid.SingleInput>
            )}
          </FeatureInputsGrid>
        </FeatureScreenLayout>
      </View>

      <SaveFavoriteModal
        visible={isSaveModalOpen}
        onSave={saveFavorite}
        onCancel={() => setIsSaveModalOpen(false)}
        placeholder="e.g. Fingertip hold switches"
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
  screenWrapper: { flex: 1 },
  toggleRow: {
    width: '100%',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f5f7f6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleLabel: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: Platform.OS === 'ios' ? 31 : undefined,
  },
  toggleLabelDisabled: {
    color: '#999',
  },
  switchWrapperIOS: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchIOS: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  note: { fontSize: 12, color: '#999', fontStyle: 'italic' },
})
