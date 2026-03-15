import { useState, useEffect } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import {
  cueCraftDefaults,
  CUE_CRAFT_FIELD_LIMITS,
  getFeatureInputSettings,
  type CueCraftUserSettings,
} from '../services/cueCraft.settings.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile } from '../services/profile.service'

export function CueCraftSettingsScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { inputSettings: is0, defaultValues: dv0 } = getFeatureInputSettings(
    undefined,
    cueCraftDefaults
  )
  const inputSettings = { ...cueCraftDefaults.inputSettings, ...is0 }
  const defaultValues = { ...cueCraftDefaults.defaultValues, ...dv0 }

  const [getReadyStep, setGetReadyStep] = useState(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState(defaultValues.getReadyTime)
  const [timerStep, setTimerStep] = useState(inputSettings.timerDuration.step)
  const [timerDefault, setTimerDefault] = useState(defaultValues.timerDuration)
  const [restStep, setRestStep] = useState(inputSettings.restDuration.step)
  const [restDefault, setRestDefault] = useState(defaultValues.restDuration)
  const [repsStep, setRepsStep] = useState(inputSettings.repsCount.step)
  const [repsDefault, setRepsDefault] = useState(defaultValues.repsCount)
  const [setsStep, setSetsStep] = useState(inputSettings.setsCount.step)
  const [setsDefault, setSetsDefault] = useState(defaultValues.setsCount)
  const [setsRestStep, setSetsRestStep] = useState(inputSettings.setsRestBetween.step)
  const [setsRestDefault, setSetsRestDefault] = useState(defaultValues.setsRestBetween)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    getProfile(session.user.id)
      .then((p) => {
        const userSettings = (p?.settings as Record<string, unknown>)
          ?.cueCraft as CueCraftUserSettings | undefined
        const { inputSettings: is, defaultValues: dv } = getFeatureInputSettings(
          userSettings,
          cueCraftDefaults
        )
        const mergedInput = { ...cueCraftDefaults.inputSettings, ...is }
        const mergedDef = { ...cueCraftDefaults.defaultValues, ...dv }
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setTimerStep(mergedInput.timerDuration.step)
        setTimerDefault(mergedDef.timerDuration)
        setRestStep(mergedInput.restDuration.step)
        setRestDefault(mergedDef.restDuration)
        setRepsStep(mergedInput.repsCount.step)
        setRepsDefault(mergedDef.repsCount)
        setSetsStep(mergedInput.setsCount.step)
        setSetsDefault(mergedDef.setsCount)
        setSetsRestStep(mergedInput.setsRestBetween.step)
        setSetsRestDefault(mergedDef.setsRestBetween)
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
      const cueCraftSettings: CueCraftUserSettings = {
        inputSettings: {
          getReadyTime: { min: cueCraftDefaults.inputSettings.getReadyTime.min, step: getReadyStep },
          timerDuration: { min: cueCraftDefaults.inputSettings.timerDuration.min, step: timerStep },
          restDuration: { min: cueCraftDefaults.inputSettings.restDuration.min, step: restStep },
          repsCount: { min: cueCraftDefaults.inputSettings.repsCount.min, step: repsStep },
          setsCount: { min: cueCraftDefaults.inputSettings.setsCount.min, step: setsStep },
          setsRestBetween: {
            min: cueCraftDefaults.inputSettings.setsRestBetween.min,
            step: setsRestStep,
          },
        },
        defaultValues: {
          getReadyTime: getReadyDefault,
          timerDuration: timerDefault,
          restDuration: restDefault,
          repsCount: repsDefault,
          setsCount: setsDefault,
          setsRestBetween: setsRestDefault,
        },
      }
      await upsertProfile(session.user.id, {
        settings: { ...currentSettings, cueCraft: cueCraftSettings },
      })
      Alert.alert('Saved', 'CueCraft settings saved successfully.')
      navigation.goBack()
    } catch (err: unknown) {
      Alert.alert('Error', (err as Error)?.message ?? 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setGetReadyStep(cueCraftDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(cueCraftDefaults.defaultValues.getReadyTime)
    setTimerStep(cueCraftDefaults.inputSettings.timerDuration.step)
    setTimerDefault(cueCraftDefaults.defaultValues.timerDuration)
    setRestStep(cueCraftDefaults.inputSettings.restDuration.step)
    setRestDefault(cueCraftDefaults.defaultValues.restDuration)
    setRepsStep(cueCraftDefaults.inputSettings.repsCount.step)
    setRepsDefault(cueCraftDefaults.defaultValues.repsCount)
    setSetsStep(cueCraftDefaults.inputSettings.setsCount.step)
    setSetsDefault(cueCraftDefaults.defaultValues.setsCount)
    setSetsRestStep(cueCraftDefaults.inputSettings.setsRestBetween.step)
    setSetsRestDefault(cueCraftDefaults.defaultValues.setsRestBetween)
  }

  if (loading) {
    return (
      <SettingsScreenLayout title="CueCraft" onSave={() => {}} onReset={() => {}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      </SettingsScreenLayout>
    )
  }

  return (
    <SettingsScreenLayout
      title="CueCraft"
      onSave={handleSave}
      onReset={handleReset}
    >
      <SettingGroup
        title="Get Ready Time"
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? cueCraftDefaults.defaultValues.getReadyTime}
        onStartValueChange={setGetReadyDefault}
        minLimit={CUE_CRAFT_FIELD_LIMITS.getReadyTime.minLimit}
      />

      <SettingGroup
        title="Timer Duration"
        step={timerStep}
        onStepChange={setTimerStep}
        startValue={timerDefault ?? cueCraftDefaults.defaultValues.timerDuration}
        onStartValueChange={setTimerDefault}
        minLimit={CUE_CRAFT_FIELD_LIMITS.timerDuration.minLimit}
      />

      <SettingGroup
        title="Rest Duration"
        step={restStep}
        onStepChange={setRestStep}
        startValue={restDefault ?? cueCraftDefaults.defaultValues.restDuration}
        onStartValueChange={setRestDefault}
        minLimit={CUE_CRAFT_FIELD_LIMITS.restDuration.minLimit}
      />

      <SettingGroup
        title="Reps Count"
        step={repsStep}
        onStepChange={setRepsStep}
        startValue={repsDefault ?? cueCraftDefaults.defaultValues.repsCount}
        onStartValueChange={setRepsDefault}
        minLimit={CUE_CRAFT_FIELD_LIMITS.repsCount.minLimit}
      />

      <SettingGroup
        title="Sets Count"
        step={setsStep}
        onStepChange={setSetsStep}
        startValue={setsDefault ?? cueCraftDefaults.defaultValues.setsCount}
        onStartValueChange={setSetsDefault}
        minLimit={CUE_CRAFT_FIELD_LIMITS.setsCount.minLimit}
      />

      <SettingGroup
        title="Rest Between Sets"
        step={setsRestStep}
        onStepChange={setSetsRestStep}
        startValue={setsRestDefault ?? cueCraftDefaults.defaultValues.setsRestBetween}
        onStartValueChange={setSetsRestDefault}
        minLimit={CUE_CRAFT_FIELD_LIMITS.setsRestBetween.minLimit}
      />
    </SettingsScreenLayout>
  )
}
