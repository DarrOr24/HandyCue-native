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

  const [getReadyStep, setGetReadyStep] = useState<number>(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState<number>(defaultValues.getReadyTime)
  const [numSetsStep, setNumSetsStep] = useState<number>(inputSettings.numSets.step)
  const [numSetsDefault, setNumSetsDefault] = useState<number>(defaultValues.numSets)
  const [restTimeStep, setRestTimeStep] = useState<number>(inputSettings.restTime.step)
  const [restTimeDefault, setRestTimeDefault] = useState<number>(defaultValues.restTime)
  const [entryCountStep, setEntryCountStep] = useState<number>(inputSettings.entryCount.step)
  const [entryCountDefault, setEntryCountDefault] = useState<number>(defaultValues.entryCount)
  const [holdTimeStep, setHoldTimeStep] = useState<number>(inputSettings.holdTime.step)
  const [holdTimeDefault, setHoldTimeDefault] = useState<number>(defaultValues.holdTime)
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
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setNumSetsStep(mergedInput.numSets.step)
        setNumSetsDefault(mergedDef.numSets)
        setRestTimeStep(mergedInput.restTime.step)
        setRestTimeDefault(mergedDef.restTime)
        setEntryCountStep(mergedInput.entryCount.step)
        setEntryCountDefault(mergedDef.entryCount)
        setHoldTimeStep(mergedInput.holdTime.step)
        setHoldTimeDefault(mergedDef.holdTime)
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
          getReadyTime: { min: entryBuddyDefaults.inputSettings.getReadyTime.min, step: getReadyStep },
          numSets: { min: entryBuddyDefaults.inputSettings.numSets.min, step: numSetsStep },
          restTime: { min: entryBuddyDefaults.inputSettings.restTime.min, step: restTimeStep },
          entryCount: { min: entryBuddyDefaults.inputSettings.entryCount.min, step: entryCountStep },
          holdTime: { min: entryBuddyDefaults.inputSettings.holdTime.min, step: holdTimeStep },
          timeBetween: { min: entryBuddyDefaults.inputSettings.timeBetween.min, step: timeBetweenStep },
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
    setGetReadyStep(entryBuddyDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(entryBuddyDefaults.defaultValues.getReadyTime)
    setNumSetsStep(entryBuddyDefaults.inputSettings.numSets.step)
    setNumSetsDefault(entryBuddyDefaults.defaultValues.numSets)
    setRestTimeStep(entryBuddyDefaults.inputSettings.restTime.step)
    setRestTimeDefault(entryBuddyDefaults.defaultValues.restTime)
    setEntryCountStep(entryBuddyDefaults.inputSettings.entryCount.step)
    setEntryCountDefault(entryBuddyDefaults.defaultValues.entryCount)
    setHoldTimeStep(entryBuddyDefaults.inputSettings.holdTime.step)
    setHoldTimeDefault(entryBuddyDefaults.defaultValues.holdTime)
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
        step={entryCountStep}
        onStepChange={setEntryCountStep}
        startValue={entryCountDefault ?? entryBuddyDefaults.defaultValues.entryCount}
        onStartValueChange={setEntryCountDefault}
        minLimit={ENTRY_BUDDY_FIELD_LIMITS.entryCount.minLimit}
      />
      <SettingGroup
        title="Hold Time"
        step={holdTimeStep}
        onStepChange={setHoldTimeStep}
        startValue={holdTimeDefault ?? entryBuddyDefaults.defaultValues.holdTime}
        onStartValueChange={setHoldTimeDefault}
        minLimit={ENTRY_BUDDY_FIELD_LIMITS.holdTime.minLimit}
      />
      <SettingGroup
        title="Time Between"
        step={timeBetweenStep}
        onStepChange={setTimeBetweenStep}
        startValue={timeBetweenDefault ?? entryBuddyDefaults.defaultValues.timeBetween}
        onStartValueChange={setTimeBetweenDefault}
        minLimit={ENTRY_BUDDY_FIELD_LIMITS.timeBetween.minLimit}
      />
      <SettingGroup
        title="Get Ready Time"
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? entryBuddyDefaults.defaultValues.getReadyTime}
        onStartValueChange={setGetReadyDefault}
        minLimit={SHARED_FIELD_LIMITS.getReadyTime.minLimit}
      />
      <SettingGroup
        title="Number of Sets"
        step={numSetsStep}
        onStepChange={setNumSetsStep}
        startValue={numSetsDefault ?? entryBuddyDefaults.defaultValues.numSets}
        onStartValueChange={setNumSetsDefault}
        minLimit={SHARED_FIELD_LIMITS.numSets.minLimit}
      />
      <SettingGroup
        title="Rest Time"
        step={restTimeStep}
        onStepChange={setRestTimeStep}
        startValue={restTimeDefault ?? entryBuddyDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
      />
    </SettingsScreenLayout>
  )
}
