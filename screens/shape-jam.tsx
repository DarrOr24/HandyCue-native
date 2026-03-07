import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import { useKeepAwake } from 'expo-keep-awake'
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
  runShapeSets,
} from '../services/shapeJam.service'
import {
  shapeJamDefaults,
  getFeatureInputSettings,
  type ShapeJamUserSettings,
} from '../services/shapeJam.settings.service'
import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
  type ShapeJamInputs,
} from '../services/shapeJam.favorites.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile } from '../services/profile.service'
import { SaveFavoriteModal } from '../components/Modals/SaveFavoriteModal'
import { FavoritesModal } from '../components/Modals/FavoritesModal'

const FEATURE_KEY = 'shapeJam'
const DEFAULT_HOLD_TIME = 1

export function ShapeJamScreen() {
  useKeepAwake()
  const navigation = useNavigation<any>()
  const { session } = useAuth()

  const [getReadyTime, setGetReadyTime] = useState<number>(shapeJamDefaults.defaultValues.getReadyTime)
  const [numReps, setNumReps] = useState<number>(shapeJamDefaults.defaultValues.numReps)
  const [numSets, setNumSets] = useState<number>(shapeJamDefaults.defaultValues.numSets)
  const [restTime, setRestTime] = useState<number>(shapeJamDefaults.defaultValues.restTime)
  const [shapes, setShapes] = useState<{ shape: string; holdTime: number }[]>(
    (shapeJamDefaults.defaultValues.shapes ?? ['tuck', 'straight']).map((shape) => ({
      shape: shape.toLowerCase(),
      holdTime: shapeJamDefaults.defaultValues.holdTime,
    }))
  )

  const [inputSettings, setInputSettings] = useState(
    shapeJamDefaults.inputSettings as typeof shapeJamDefaults.inputSettings
  )
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>>(null)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)

  const [displayContent, setDisplayContent] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'getReady' | 'shapes' | 'rest' | 'done'>('idle')

  const resetSignalRef = useRef(createResetSignal())
  const voiceRef = useRef<{ identifier: string; name: string } | null>(null)

  const favorites = getFavoritesForFeature<ShapeJamInputs>(profile, FEATURE_KEY)

  const baseShapes = inputSettings.shapes ?? []
  const allShapeValues = [
    ...new Set([
      ...baseShapes.map((s) => s.toLowerCase()),
      ...shapes.map((s) => s.shape),
    ]),
  ]
  const shapeOptions: SelectOption[] = allShapeValues.map((s) => ({
    value: s.toLowerCase(),
    label: s[0].toUpperCase() + s.slice(1),
  }))

  const menuHandlersRef = useRef({
    onInfo: () => navigation.navigate('ShapeJamInfo'),
    onSetVoice: () => navigation.navigate('VoiceSet'),
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: () => navigation.navigate('ShapeJamSettings'),
    session,
  })
  menuHandlersRef.current = {
    onInfo: () => navigation.navigate('ShapeJamInfo'),
    onSetVoice: () => navigation.navigate('VoiceSet'),
    onFavorites: () => setIsFavoritesModalOpen(true),
    onSave: () => setIsSaveModalOpen(true),
    onSettings: () => navigation.navigate('ShapeJamSettings'),
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
        setInputSettings(shapeJamDefaults.inputSettings)
        return
      }
      getProfile(session.user.id)
        .then((p) => {
          setProfile(p)
          const userSettings = (p?.settings as Record<string, unknown>)?.shapeJam as
            | ShapeJamUserSettings
            | null
            | undefined
          const { inputSettings: is, defaultValues } = getFeatureInputSettings(
            userSettings,
            shapeJamDefaults
          )
          const merged = {
            ...shapeJamDefaults.inputSettings,
            ...is,
          } as typeof shapeJamDefaults.inputSettings
          setInputSettings(merged)
          const dv = defaultValues as Record<string, unknown>
          setGetReadyTime((dv.getReadyTime as number) ?? shapeJamDefaults.defaultValues.getReadyTime)
          setNumReps((dv.numReps as number) ?? shapeJamDefaults.defaultValues.numReps)
          setNumSets((dv.numSets as number) ?? shapeJamDefaults.defaultValues.numSets)
          setRestTime((dv.restTime as number) ?? shapeJamDefaults.defaultValues.restTime)
          const defaultShapes = (dv.shapes as string[]) ?? shapeJamDefaults.defaultValues.shapes ?? []
          if (defaultShapes.length > 0) {
            setShapes(
              defaultShapes.map((shape) => ({
                shape: shape.toLowerCase(),
                holdTime: (dv.holdTime as number) ?? shapeJamDefaults.defaultValues.holdTime,
              }))
            )
          }
        })
        .catch(() => {
          setProfile(null)
          setInputSettings(shapeJamDefaults.inputSettings)
        })
    }, [session?.user?.id])
  )

  useFocusEffect(
    useCallback(() => {
      getVoice(session?.user?.id).then((v) => {
        voiceRef.current = v
      })
    }, [session?.user?.id])
  )

  useEffect(() => {
    return () => {
      stopSpeech()
    }
  }, [])

  const inputsDisabled = phase !== 'idle' && phase !== 'done'
  const sessionDone = phase === 'done'
  const hasStarted = phase !== 'idle'

  const startPlayIcon = phase === 'shapes' || phase === 'rest' ? 'play' : 'play'
  const startPlayDisabled = inputsDisabled
  const resetEnabled = hasStarted

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

    setPhase('shapes')
    setDisplayContent('')

    runShapeSets({
      numSets,
      numReps,
      shapes,
      restTime,
      storedVoice: voiceRef.current,
      onDisplay: setDisplayContent,
      onRestTick: (_, display) => setDisplayContent(display),
      isCancelled: () => resetSignalRef.current.isCancelled(),
    })
      .then(async () => {
        if (resetSignalRef.current.isCancelled()) return
        await speak('Session over. Good job!', voiceRef.current)
        if (resetSignalRef.current.isCancelled()) return
        setPhase('done')
        setDisplayContent('')
      })
      .catch(() => {})
  }

  function handleReset() {
    resetSignalRef.current.signal()
    stopSpeech()
    setPhase('idle')
    setDisplayContent(null)
  }

  function addShape() {
    setShapes([...shapes, { shape: 'tuck', holdTime: DEFAULT_HOLD_TIME }])
  }

  function removeShape(idx: number) {
    if (shapes.length <= 2) return
    setShapes(shapes.filter((_, i) => i !== idx))
  }

  function updateShape(idx: number, field: 'shape' | 'holdTime', value: string | number) {
    const updated = [...shapes]
    updated[idx] = { ...updated[idx], [field]: value }
    setShapes(updated)
  }

  function getCurrentInputs(): ShapeJamInputs {
    return {
      getReadyTime,
      numReps,
      numSets,
      restTime,
      shapes: shapes.map(({ shape, holdTime }) => ({ shape, holdTime })),
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
    const { getReadyTime: gr, numReps: nr, numSets: ns, restTime: rt, shapes: sh } = fav.inputs
    setGetReadyTime(gr)
    setNumReps(nr)
    setNumSets(ns)
    setRestTime(rt)
    setShapes(sh ?? shapes)
    setIsFavoritesModalOpen(false)
  }

  const timerContent =
    phase === 'done' ? (
      <TimerDisplay content={<Ionicons name="trophy" size={48} color="#5B9A8B" />} />
    ) : phase === 'idle' && !displayContent ? (
      <TimerDisplay
        content={<Ionicons name="shapes-outline" size={48} color="#5B9A8B" />}
      />
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
            primaryIcon={startPlayIcon}
            onPrimaryPress={handleStart}
            primaryDisabled={startPlayDisabled}
            onReset={handleReset}
            resetDisabled={!resetEnabled}
          />
        }
        inputsDisabled={inputsDisabled}
        footer={<Text style={styles.note}>* All time values are in seconds</Text>}
        >
          <FeatureInputsGrid>
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

          {shapes.map((shapeObj, idx) => (
            <View key={idx} style={styles.shapeRow}>
              <SelectInput
                label={`Shape ${idx + 1}`}
                options={shapeOptions}
                value={shapeObj.shape}
                onChange={(v) => updateShape(idx, 'shape', v)}
                disabled={inputsDisabled}
                onRemove={shapes.length > 2 ? () => removeShape(idx) : undefined}
              />
              <NumberInput
                label={`Hold ${idx + 1}`}
                value={shapeObj.holdTime}
                onDecrease={() =>
                  updateShape(
                    idx,
                    'holdTime',
                    Math.max(inputSettings.holdTime.min, shapeObj.holdTime - inputSettings.holdTime.step)
                  )
                }
                onIncrease={() =>
                  updateShape(
                    idx,
                    'holdTime',
                    shapeObj.holdTime + inputSettings.holdTime.step
                  )
                }
                disabled={inputsDisabled}
              />
            </View>
          ))}

          <NumberInput
            label="Sets"
            value={numSets}
            onDecrease={() =>
              setNumSets((v) =>
                Math.max(inputSettings.numSets.step, v - inputSettings.numSets.step)
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
        <TouchableOpacity
          style={[styles.addShapeAbsolute, inputsDisabled && styles.addShapeAbsoluteDisabled]}
          onPress={addShape}
          disabled={inputsDisabled}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={inputsDisabled ? '#999' : '#5B9A8B'}
          />
          <Text style={[styles.addShapeText, inputsDisabled && styles.addShapeTextDisabled]}>
            Add Shape
          </Text>
        </TouchableOpacity>
      </View>

      <SaveFavoriteModal
        visible={isSaveModalOpen}
        onSave={saveFavorite}
        onCancel={() => setIsSaveModalOpen(false)}
        placeholder="e.g. Tuck – Straddle – Straight"
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
  screenWrapper: {
    flex: 1,
  },
  shapeRow: {
    flexDirection: 'row',
    flex: 1,
    minWidth: '100%',
    gap: 12,
  },
  addShapeAbsolute: {
    position: 'absolute',
    top: 8,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  addShapeAbsoluteDisabled: {
    opacity: 0.6,
  },
  addShapeText: {
    fontSize: 15,
    color: '#5B9A8B',
    fontWeight: '500',
  },
  addShapeTextDisabled: {
    color: '#999',
  },
  note: { fontSize: 12, color: '#999', fontStyle: 'italic' },
})
