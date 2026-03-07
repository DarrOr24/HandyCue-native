import { useState, useEffect } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import {
  holdOnDefaults,
  SHARED_FIELD_LIMITS,
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

  const [getReadyStep, setGetReadyStep] = useState(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState(defaultValues.getReadyTime)
  const [numSetsStep, setNumSetsStep] = useState(inputSettings.numSets.step)
  const [numSetsDefault, setNumSetsDefault] = useState(defaultValues.numSets)
  const [restTimeStep, setRestTimeStep] = useState(inputSettings.restTime.step)
  const [restTimeDefault, setRestTimeDefault] = useState(defaultValues.restTime)
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
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setNumSetsStep(mergedInput.numSets.step)
        setNumSetsDefault(mergedDef.numSets)
        setRestTimeStep(mergedInput.restTime.step)
        setRestTimeDefault(mergedDef.restTime)
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
          getReadyTime: { min: holdOnDefaults.inputSettings.getReadyTime.min, step: getReadyStep },
          numSets: { min: holdOnDefaults.inputSettings.numSets.min, step: numSetsStep },
          restTime: { min: holdOnDefaults.inputSettings.restTime.min, step: restTimeStep },
          holdTime: { min: holdOnDefaults.inputSettings.holdTime.min, step: holdTimeStep },
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
    setGetReadyStep(holdOnDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(holdOnDefaults.defaultValues.getReadyTime)
    setNumSetsStep(holdOnDefaults.inputSettings.numSets.step)
    setNumSetsDefault(holdOnDefaults.defaultValues.numSets)
    setRestTimeStep(holdOnDefaults.inputSettings.restTime.step)
    setRestTimeDefault(holdOnDefaults.defaultValues.restTime)
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
        step={holdTimeStep}
        onStepChange={setHoldTimeStep}
        startValue={holdTimeDefault ?? holdOnDefaults.defaultValues.holdTime}
        onStartValueChange={setHoldTimeDefault}
        minLimit={holdTimeStep}
      />

      <SettingGroup
        title="Get Ready Time"
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? holdOnDefaults.defaultValues.getReadyTime}
        onStartValueChange={setGetReadyDefault}
        minLimit={SHARED_FIELD_LIMITS.getReadyTime.minLimit}
      />

      <SettingGroup
        title="Number of Sets"
        step={numSetsStep}
        onStepChange={setNumSetsStep}
        startValue={numSetsDefault ?? holdOnDefaults.defaultValues.numSets}
        onStartValueChange={setNumSetsDefault}
        minLimit={SHARED_FIELD_LIMITS.numSets.minLimit}
      />

      <SettingGroup
        title="Rest Time"
        step={restTimeStep}
        onStepChange={setRestTimeStep}
        startValue={restTimeDefault ?? holdOnDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
      />
    </SettingsScreenLayout>
  )
}
