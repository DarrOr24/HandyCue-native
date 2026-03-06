import { useState, useEffect, useRef, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
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

const DEFAULT_HOLD = 60
const DEFAULT_GET_READY = 5
const DEFAULT_SETS = 1
const DEFAULT_REST = 60
const DEFAULT_CALLOUT_STEP = 10

export function HoldOnScreen() {
  useKeepAwake()

  const [holdTime, setHoldTime] = useState(DEFAULT_HOLD)
  const [getReadyTime, setGetReadyTime] = useState(DEFAULT_GET_READY)
  const [numSets, setNumSets] = useState(DEFAULT_SETS)
  const [restTime, setRestTime] = useState(DEFAULT_REST)
  const [calloutStep, setCalloutStep] = useState(DEFAULT_CALLOUT_STEP)

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

  return (
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
          onDecrease={() => setHoldTime((v) => Math.max(5, v - 5))}
          onIncrease={() => setHoldTime((v) => Math.min(600, v + 5))}
          disabled={inputsDisabled}
        />
        <NumberInput
          label="Get ready"
          value={getReadyTime}
          onDecrease={() => setGetReadyTime((v) => Math.max(0, v - 1))}
          onIncrease={() => setGetReadyTime((v) => Math.min(30, v + 1))}
          disabled={inputsDisabled}
        />
        <NumberInput
          label="Sets"
          value={numSets}
          onDecrease={() => setNumSets((v) => Math.max(1, v - 1))}
          onIncrease={() => setNumSets((v) => Math.min(20, v + 1))}
          disabled={inputsDisabled}
        />
        {numSets > 1 && (
          <NumberInput
            label="Rest time"
            value={restTime}
            onDecrease={() => setRestTime((v) => Math.max(5, v - 5))}
            onIncrease={() => setRestTime((v) => Math.min(600, v + 5))}
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
