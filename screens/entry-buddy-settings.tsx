import { useState, useEffect } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import {
  entryBuddyDefaults,
  SHARED_FIELD_LIMITS,
  ENTRY_BUDDY_FIELD_LIMITS,
  getFeatureInputSettings,
  type EntryBuddyUserSettings,
} from '../services/entryBuddy.settings.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile } from '../services/profile.service'

export function EntryBuddySettingsScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { inputSettings: is0, defaultValues: dv0 } = getFeatureInputSettings(
    undefined,
    entryBuddyDefaults
  )
  const inputSettings = { ...entryBuddyDefaults.inputSettings, ...is0 }
  const defaultValues = { ...entryBuddyDefaults.defaultValues, ...dv0 }

  const [getReadyRange, setGetReadyRange] = useState<[number, number]>([
    inputSettings.getReadyTime.min,
    inputSettings.getReadyTime.max,
  ])
  const [getReadyStep, setGetReadyStep] = useState<number>(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState<number>(defaultValues.getReadyTime)

  const [numSetsRange, setNumSetsRange] = useState<[number, number]>([
    inputSettings.numSets.min,
    inputSettings.numSets.max,
  ])
  const [numSetsStep, setNumSetsStep] = useState<number>(inputSettings.numSets.step)
  const [numSetsDefault, setNumSetsDefault] = useState<number>(defaultValues.numSets)

  const [restTimeRange, setRestTimeRange] = useState<[number, number]>([
    inputSettings.restTime.min,
    inputSettings.restTime.max,
  ])
  const [restTimeStep, setRestTimeStep] = useState<number>(inputSettings.restTime.step)
  const [restTimeDefault, setRestTimeDefault] = useState<number>(defaultValues.restTime)

  const [entryCountRange, setEntryCountRange] = useState<[number, number]>([
    inputSettings.entryCount.min,
    inputSettings.entryCount.max,
  ])
  const [entryCountStep, setEntryCountStep] = useState<number>(inputSettings.entryCount.step)
  const [entryCountDefault, setEntryCountDefault] = useState<number>(defaultValues.entryCount)

  const [holdTimeRange, setHoldTimeRange] = useState<[number, number]>([
    inputSettings.holdTime.min,
    inputSettings.holdTime.max,
  ])
  const [holdTimeStep, setHoldTimeStep] = useState<number>(inputSettings.holdTime.step)
  const [holdTimeDefault, setHoldTimeDefault] = useState<number>(defaultValues.holdTime)

  const [timeBetweenRange, setTimeBetweenRange] = useState<[number, number]>([
    inputSettings.timeBetween.min,
    inputSettings.timeBetween.max,
  ])
  const [timeBetweenStep, setTimeBetweenStep] = useState<number>(inputSettings.timeBetween.step)
  const [timeBetweenDefault, setTimeBetweenDefault] = useState<number>(defaultValues.timeBetween)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    getProfile(session.user.id)
      .then((p) => {
        const userSettings = (p?.settings as Record<string, unknown>)
          ?.entryBuddy as EntryBuddyUserSettings | undefined
        const { inputSettings: is, defaultValues: dv } = getFeatureInputSettings(
          userSettings,
          entryBuddyDefaults
        )
        const mergedInput = { ...entryBuddyDefaults.inputSettings, ...is }
        const mergedDef = { ...entryBuddyDefaults.defaultValues, ...dv }
        setGetReadyRange([mergedInput.getReadyTime.min, mergedInput.getReadyTime.max])
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setNumSetsRange([mergedInput.numSets.min, mergedInput.numSets.max])
        setNumSetsStep(mergedInput.numSets.step)
        setNumSetsDefault(mergedDef.numSets)
        setRestTimeRange([mergedInput.restTime.min, mergedInput.restTime.max])
        setRestTimeStep(mergedInput.restTime.step)
        setRestTimeDefault(mergedDef.restTime)
        setEntryCountRange([mergedInput.entryCount.min, mergedInput.entryCount.max])
        setEntryCountStep(mergedInput.entryCount.step)
        setEntryCountDefault(mergedDef.entryCount)
        setHoldTimeRange([mergedInput.holdTime.min, mergedInput.holdTime.max])
        setHoldTimeStep(mergedInput.holdTime.step)
        setHoldTimeDefault(mergedDef.holdTime)
        setTimeBetweenRange([mergedInput.timeBetween.min, mergedInput.timeBetween.max])
        setTimeBetweenStep(mergedInput.timeBetween.step)
        setTimeBetweenDefault(mergedDef.timeBetween)
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
      const entryBuddySettings = {
        inputSettings: {
          getReadyTime: { min: getReadyRange[0], max: getReadyRange[1], step: getReadyStep },
          numSets: { min: numSetsRange[0], max: numSetsRange[1], step: numSetsStep },
          restTime: { min: restTimeRange[0], max: restTimeRange[1], step: restTimeStep },
          entryCount: { min: entryCountRange[0], max: entryCountRange[1], step: entryCountStep },
          holdTime: { min: holdTimeRange[0], max: holdTimeRange[1], step: holdTimeStep },
          timeBetween: { min: timeBetweenRange[0], max: timeBetweenRange[1], step: timeBetweenStep },
        },
        defaultValues: {
          getReadyTime: getReadyDefault,
          numSets: numSetsDefault,
          restTime: restTimeDefault,
          entryCount: entryCountDefault,
          holdTime: holdTimeDefault,
          timeBetween: timeBetweenDefault,
        },
      }
      await upsertProfile(session.user.id, {
        settings: { ...currentSettings, entryBuddy: entryBuddySettings },
      })
      Alert.alert('Saved', 'EntryBuddy settings saved successfully.')
      navigation.goBack()
    } catch (err: unknown) {
      Alert.alert('Error', (err as Error)?.message ?? 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setGetReadyRange([
      entryBuddyDefaults.inputSettings.getReadyTime.min,
      entryBuddyDefaults.inputSettings.getReadyTime.max,
    ])
    setGetReadyStep(entryBuddyDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(entryBuddyDefaults.defaultValues.getReadyTime)
    setNumSetsRange([
      entryBuddyDefaults.inputSettings.numSets.min,
      entryBuddyDefaults.inputSettings.numSets.max,
    ])
    setNumSetsStep(entryBuddyDefaults.inputSettings.numSets.step)
    setNumSetsDefault(entryBuddyDefaults.defaultValues.numSets)
    setRestTimeRange([
      entryBuddyDefaults.inputSettings.restTime.min,
      entryBuddyDefaults.inputSettings.restTime.max,
    ])
    setRestTimeStep(entryBuddyDefaults.inputSettings.restTime.step)
    setRestTimeDefault(entryBuddyDefaults.defaultValues.restTime)
    setEntryCountRange([
      entryBuddyDefaults.inputSettings.entryCount.min,
      entryBuddyDefaults.inputSettings.entryCount.max,
    ])
    setEntryCountStep(entryBuddyDefaults.inputSettings.entryCount.step)
    setEntryCountDefault(entryBuddyDefaults.defaultValues.entryCount)
    setHoldTimeRange([
      entryBuddyDefaults.inputSettings.holdTime.min,
      entryBuddyDefaults.inputSettings.holdTime.max,
    ])
    setHoldTimeStep(entryBuddyDefaults.inputSettings.holdTime.step)
    setHoldTimeDefault(entryBuddyDefaults.defaultValues.holdTime)
    setTimeBetweenRange([
      entryBuddyDefaults.inputSettings.timeBetween.min,
      entryBuddyDefaults.inputSettings.timeBetween.max,
    ])
    setTimeBetweenStep(entryBuddyDefaults.inputSettings.timeBetween.step)
    setTimeBetweenDefault(entryBuddyDefaults.defaultValues.timeBetween)
  }

  if (loading) {
    return (
      <SettingsScreenLayout title="EntryBuddy" onSave={() => {}} onReset={() => {}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      </SettingsScreenLayout>
    )
  }

  return (
    <SettingsScreenLayout
      title="EntryBuddy"
      onSave={handleSave}
      onReset={handleReset}
    >
      <SettingGroup
        title="Entry Count"
        range={entryCountRange}
        onRangeChange={setEntryCountRange}
        step={entryCountStep}
        onStepChange={setEntryCountStep}
        startValue={entryCountDefault ?? entryBuddyDefaults.defaultValues.entryCount}
        onStartValueChange={setEntryCountDefault}
        minLimit={ENTRY_BUDDY_FIELD_LIMITS.entryCount.minLimit}
        maxLimit={ENTRY_BUDDY_FIELD_LIMITS.entryCount.maxLimit}
      />
      <SettingGroup
        title="Hold Time"
        range={holdTimeRange}
        onRangeChange={setHoldTimeRange}
        step={holdTimeStep}
        onStepChange={setHoldTimeStep}
        startValue={holdTimeDefault ?? entryBuddyDefaults.defaultValues.holdTime}
        onStartValueChange={setHoldTimeDefault}
        minLimit={ENTRY_BUDDY_FIELD_LIMITS.holdTime.minLimit}
        maxLimit={ENTRY_BUDDY_FIELD_LIMITS.holdTime.maxLimit}
      />
      <SettingGroup
        title="Time Between"
        range={timeBetweenRange}
        onRangeChange={setTimeBetweenRange}
        step={timeBetweenStep}
        onStepChange={setTimeBetweenStep}
        startValue={timeBetweenDefault ?? entryBuddyDefaults.defaultValues.timeBetween}
        onStartValueChange={setTimeBetweenDefault}
        minLimit={ENTRY_BUDDY_FIELD_LIMITS.timeBetween.minLimit}
        maxLimit={ENTRY_BUDDY_FIELD_LIMITS.timeBetween.maxLimit}
      />
      <SettingGroup
        title="Get Ready Time"
        range={getReadyRange}
        onRangeChange={setGetReadyRange}
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? entryBuddyDefaults.defaultValues.getReadyTime}
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
        startValue={numSetsDefault ?? entryBuddyDefaults.defaultValues.numSets}
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
        startValue={restTimeDefault ?? entryBuddyDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.restTime.maxLimit}
      />
    </SettingsScreenLayout>
  )
}
