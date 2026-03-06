import { useState, useEffect } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import {
  holdOnDefaults,
  SHARED_FIELD_LIMITS,
  HOLD_TIME_LIMITS,
  getFeatureInputSettings,
  type HoldOnUserSettings,
} from '../services/holdOn.settings.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile } from '../services/profile.service'

export function HoldOnSettingsScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { inputSettings: is0, defaultValues: dv0 } = getFeatureInputSettings(undefined, holdOnDefaults)
  const inputSettings = { ...holdOnDefaults.inputSettings, ...is0 }
  const defaultValues = { ...holdOnDefaults.defaultValues, ...dv0 }

  // Get Ready
  const [getReadyRange, setGetReadyRange] = useState<[number, number]>([
    inputSettings.getReadyTime.min,
    inputSettings.getReadyTime.max,
  ])
  const [getReadyStep, setGetReadyStep] = useState(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState(defaultValues.getReadyTime)

  // Number of Sets
  const [numSetsRange, setNumSetsRange] = useState<[number, number]>([
    inputSettings.numSets.min,
    inputSettings.numSets.max,
  ])
  const [numSetsStep, setNumSetsStep] = useState(inputSettings.numSets.step)
  const [numSetsDefault, setNumSetsDefault] = useState(defaultValues.numSets)

  // Rest Time
  const [restTimeRange, setRestTimeRange] = useState<[number, number]>([
    inputSettings.restTime.min,
    inputSettings.restTime.max,
  ])
  const [restTimeStep, setRestTimeStep] = useState(inputSettings.restTime.step)
  const [restTimeDefault, setRestTimeDefault] = useState(defaultValues.restTime)

  // Hold Time
  const [holdTimeRange, setHoldTimeRange] = useState<[number, number]>([
    inputSettings.holdTime.min,
    inputSettings.holdTime.max,
  ])
  const [holdTimeStep, setHoldTimeStep] = useState(inputSettings.holdTime.step)
  const [holdTimeDefault, setHoldTimeDefault] = useState(defaultValues.holdTime)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    getProfile(session.user.id)
      .then((p) => {
        const userSettings = (p?.settings as Record<string, unknown>)?.holdOn as HoldOnUserSettings | undefined
        const { inputSettings: is, defaultValues: dv } = getFeatureInputSettings(userSettings, holdOnDefaults)
        const mergedInput = { ...holdOnDefaults.inputSettings, ...is }
        const mergedDef = { ...holdOnDefaults.defaultValues, ...dv }
        setGetReadyRange([mergedInput.getReadyTime.min, mergedInput.getReadyTime.max])
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setNumSetsRange([mergedInput.numSets.min, mergedInput.numSets.max])
        setNumSetsStep(mergedInput.numSets.step)
        setNumSetsDefault(mergedDef.numSets)
        setRestTimeRange([mergedInput.restTime.min, mergedInput.restTime.max])
        setRestTimeStep(mergedInput.restTime.step)
        setRestTimeDefault(mergedDef.restTime)
        setHoldTimeRange([mergedInput.holdTime.min, mergedInput.holdTime.max])
        setHoldTimeStep(mergedInput.holdTime.step)
        setHoldTimeDefault(mergedDef.holdTime)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  async function handleSave() {
    if (!session?.user?.id) {
      Alert.alert('Log in required', 'Please log in to save your settings.')
      return
    }
    setSaving(true)
    try {
      const profile = await getProfile(session.user.id)
      const currentSettings = (profile?.settings as Record<string, unknown>) ?? {}
      const holdOnSettings = {
        inputSettings: {
          getReadyTime: { min: getReadyRange[0], max: getReadyRange[1], step: getReadyStep },
          numSets: { min: numSetsRange[0], max: numSetsRange[1], step: numSetsStep },
          restTime: { min: restTimeRange[0], max: restTimeRange[1], step: restTimeStep },
          holdTime: { min: holdTimeRange[0], max: holdTimeRange[1], step: holdTimeStep },
        },
        defaultValues: {
          getReadyTime: getReadyDefault,
          numSets: numSetsDefault,
          restTime: restTimeDefault,
          holdTime: holdTimeDefault,
        },
      }
      await upsertProfile(session.user.id, {
        settings: { ...currentSettings, holdOn: holdOnSettings },
      })
      Alert.alert('Saved', 'HoldOn settings saved successfully.')
      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setGetReadyRange([holdOnDefaults.inputSettings.getReadyTime.min, holdOnDefaults.inputSettings.getReadyTime.max])
    setGetReadyStep(holdOnDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(holdOnDefaults.defaultValues.getReadyTime)

    setNumSetsRange([holdOnDefaults.inputSettings.numSets.min, holdOnDefaults.inputSettings.numSets.max])
    setNumSetsStep(holdOnDefaults.inputSettings.numSets.step)
    setNumSetsDefault(holdOnDefaults.defaultValues.numSets)

    setRestTimeRange([holdOnDefaults.inputSettings.restTime.min, holdOnDefaults.inputSettings.restTime.max])
    setRestTimeStep(holdOnDefaults.inputSettings.restTime.step)
    setRestTimeDefault(holdOnDefaults.defaultValues.restTime)

    setHoldTimeRange([holdOnDefaults.inputSettings.holdTime.min, holdOnDefaults.inputSettings.holdTime.max])
    setHoldTimeStep(holdOnDefaults.inputSettings.holdTime.step)
    setHoldTimeDefault(holdOnDefaults.defaultValues.holdTime)
  }

  if (loading) {
    return (
      <SettingsScreenLayout title="HoldOn" onSave={() => {}} onReset={() => {}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      </SettingsScreenLayout>
    )
  }

  return (
    <SettingsScreenLayout
      title="HoldOn"
      onSave={handleSave}
      onReset={handleReset}
    >
      <SettingGroup
        title="Hold Time"
        range={holdTimeRange}
        onRangeChange={setHoldTimeRange}
        step={holdTimeStep}
        onStepChange={setHoldTimeStep}
        startValue={holdTimeDefault ?? holdOnDefaults.defaultValues.holdTime}
        onStartValueChange={setHoldTimeDefault}
        minLimit={HOLD_TIME_LIMITS.minLimit}
        maxLimit={HOLD_TIME_LIMITS.maxLimit}
      />

      <SettingGroup
        title="Get Ready Time"
        range={getReadyRange}
        onRangeChange={setGetReadyRange}
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? holdOnDefaults.defaultValues.getReadyTime}
        onStartValueChange={setGetReadyDefault}
        minLimit={SHARED_FIELD_LIMITS.getReadyTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.getReadyTime.maxLimit}
      />

      <SettingGroup
        title="Number of Sets"
        range={numSetsRange}
        onRangeChange={setNumSetsRange}
        step={numSetsStep}
        onStepChange={setNumSetsStep}
        startValue={numSetsDefault ?? holdOnDefaults.defaultValues.numSets}
        onStartValueChange={setNumSetsDefault}
        minLimit={SHARED_FIELD_LIMITS.numSets.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.numSets.maxLimit}
      />

      <SettingGroup
        title="Rest Time"
        range={restTimeRange}
        onRangeChange={setRestTimeRange}
        step={restTimeStep}
        onStepChange={setRestTimeStep}
        startValue={restTimeDefault ?? holdOnDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.restTime.maxLimit}
      />
    </SettingsScreenLayout>
  )
}
