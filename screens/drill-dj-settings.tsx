import { useState, useEffect } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import {
  drillDJDefaults,
  SHARED_FIELD_LIMITS,
  DRILL_TIME_LIMITS,
  getFeatureInputSettings,
  type DrillDJUserSettings,
} from '../services/drillDJ.settings.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile } from '../services/profile.service'

export function DrillDJSettingsScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { inputSettings: is0, defaultValues: dv0 } = getFeatureInputSettings(undefined, drillDJDefaults)
  const inputSettings = { ...drillDJDefaults.inputSettings, ...is0 }
  const defaultValues = { ...drillDJDefaults.defaultValues, ...dv0 }

  const [getReadyStep, setGetReadyStep] = useState(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState(defaultValues.getReadyTime)
  const [numSetsStep, setNumSetsStep] = useState(inputSettings.numSets.step)
  const [numSetsDefault, setNumSetsDefault] = useState(defaultValues.numSets)
  const [restTimeStep, setRestTimeStep] = useState(inputSettings.restTime.step)
  const [restTimeDefault, setRestTimeDefault] = useState(defaultValues.restTime)
  const [slideTimeStep, setSlideTimeStep] = useState(inputSettings.slideTime.step)
  const [slideTimeDefault, setSlideTimeDefault] = useState(defaultValues.slideTime)
  const [timeBetweenSlidesStep, setTimeBetweenSlidesStep] = useState(inputSettings.timeBetweenSlides.step)
  const [timeBetweenSlidesDefault, setTimeBetweenSlidesDefault] = useState(defaultValues.timeBetweenSlides)
  const [floatTimeStep, setFloatTimeStep] = useState(inputSettings.floatTime.step)
  const [floatTimeDefault, setFloatTimeDefault] = useState(defaultValues.floatTime)
  const [timeBetweenFloatsStep, setTimeBetweenFloatsStep] = useState(inputSettings.timeBetweenFloats.step)
  const [timeBetweenFloatsDefault, setTimeBetweenFloatsDefault] = useState(defaultValues.timeBetweenFloats)
  const [switchTimeStep, setSwitchTimeStep] = useState(inputSettings.switchTime.step)
  const [switchTimeDefault, setSwitchTimeDefault] = useState(defaultValues.switchTime)
  const [timeBetweenSwitchesStep, setTimeBetweenSwitchesStep] = useState(inputSettings.timeBetweenSwitches.step)
  const [timeBetweenSwitchesDefault, setTimeBetweenSwitchesDefault] = useState(defaultValues.timeBetweenSwitches)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    getProfile(session.user.id)
      .then((p) => {
        const userSettings = (p?.settings as Record<string, unknown>)?.drillDJ as DrillDJUserSettings | undefined
        const { inputSettings: is, defaultValues: dv } = getFeatureInputSettings(userSettings, drillDJDefaults)
        const mergedInput = { ...drillDJDefaults.inputSettings, ...is }
        const mergedDef = { ...drillDJDefaults.defaultValues, ...dv }
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setNumSetsStep(mergedInput.numSets.step)
        setNumSetsDefault(mergedDef.numSets)
        setRestTimeStep(mergedInput.restTime.step)
        setRestTimeDefault(mergedDef.restTime)
        setSlideTimeStep(mergedInput.slideTime.step)
        setSlideTimeDefault(mergedDef.slideTime)
        setTimeBetweenSlidesStep(mergedInput.timeBetweenSlides.step)
        setTimeBetweenSlidesDefault(mergedDef.timeBetweenSlides)
        setFloatTimeStep(mergedInput.floatTime.step)
        setFloatTimeDefault(mergedDef.floatTime)
        setTimeBetweenFloatsStep(mergedInput.timeBetweenFloats.step)
        setTimeBetweenFloatsDefault(mergedDef.timeBetweenFloats)
        setSwitchTimeStep(mergedInput.switchTime.step)
        setSwitchTimeDefault(mergedDef.switchTime)
        setTimeBetweenSwitchesStep(mergedInput.timeBetweenSwitches.step)
        setTimeBetweenSwitchesDefault(mergedDef.timeBetweenSwitches)
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
      const drillDJSettings = {
        inputSettings: {
          getReadyTime: { min: drillDJDefaults.inputSettings.getReadyTime.min, step: getReadyStep },
          numSets: { min: drillDJDefaults.inputSettings.numSets.min, step: numSetsStep },
          restTime: { min: drillDJDefaults.inputSettings.restTime.min, step: restTimeStep },
          slideTime: { min: drillDJDefaults.inputSettings.slideTime.min, step: slideTimeStep },
          timeBetweenSlides: { min: drillDJDefaults.inputSettings.timeBetweenSlides.min, step: timeBetweenSlidesStep },
          floatTime: { min: drillDJDefaults.inputSettings.floatTime.min, step: floatTimeStep },
          timeBetweenFloats: { min: drillDJDefaults.inputSettings.timeBetweenFloats.min, step: timeBetweenFloatsStep },
          switchTime: { min: drillDJDefaults.inputSettings.switchTime.min, step: switchTimeStep },
          timeBetweenSwitches: { min: drillDJDefaults.inputSettings.timeBetweenSwitches.min, step: timeBetweenSwitchesStep },
        },
        defaultValues: {
          getReadyTime: getReadyDefault,
          numSets: numSetsDefault,
          restTime: restTimeDefault,
          slideTime: slideTimeDefault,
          timeBetweenSlides: timeBetweenSlidesDefault,
          floatTime: floatTimeDefault,
          timeBetweenFloats: timeBetweenFloatsDefault,
          switchTime: switchTimeDefault,
          timeBetweenSwitches: timeBetweenSwitchesDefault,
        },
      }
      await upsertProfile(session.user.id, {
        settings: { ...currentSettings, drillDJ: drillDJSettings },
      })
      Alert.alert('Saved', 'DrillDJ settings saved successfully.')
      navigation.goBack()
    } catch (err: unknown) {
      Alert.alert('Error', (err as Error)?.message ?? 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setGetReadyStep(drillDJDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(drillDJDefaults.defaultValues.getReadyTime)
    setNumSetsStep(drillDJDefaults.inputSettings.numSets.step)
    setNumSetsDefault(drillDJDefaults.defaultValues.numSets)
    setRestTimeStep(drillDJDefaults.inputSettings.restTime.step)
    setRestTimeDefault(drillDJDefaults.defaultValues.restTime)
    setSlideTimeStep(drillDJDefaults.inputSettings.slideTime.step)
    setSlideTimeDefault(drillDJDefaults.defaultValues.slideTime)
    setTimeBetweenSlidesStep(drillDJDefaults.inputSettings.timeBetweenSlides.step)
    setTimeBetweenSlidesDefault(drillDJDefaults.defaultValues.timeBetweenSlides)
    setFloatTimeStep(drillDJDefaults.inputSettings.floatTime.step)
    setFloatTimeDefault(drillDJDefaults.defaultValues.floatTime)
    setTimeBetweenFloatsStep(drillDJDefaults.inputSettings.timeBetweenFloats.step)
    setTimeBetweenFloatsDefault(drillDJDefaults.defaultValues.timeBetweenFloats)
    setSwitchTimeStep(drillDJDefaults.inputSettings.switchTime.step)
    setSwitchTimeDefault(drillDJDefaults.defaultValues.switchTime)
    setTimeBetweenSwitchesStep(drillDJDefaults.inputSettings.timeBetweenSwitches.step)
    setTimeBetweenSwitchesDefault(drillDJDefaults.defaultValues.timeBetweenSwitches)
  }

  if (loading) {
    return (
      <SettingsScreenLayout title="DrillDJ" onSave={() => {}} onReset={() => {}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      </SettingsScreenLayout>
    )
  }

  return (
    <SettingsScreenLayout title="DrillDJ" onSave={handleSave} onReset={handleReset}>
      <SettingGroup
        title="Slide Time"
        step={slideTimeStep}
        onStepChange={setSlideTimeStep}
        startValue={slideTimeDefault ?? drillDJDefaults.defaultValues.slideTime}
        onStartValueChange={setSlideTimeDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
      />
      <SettingGroup
        title="Time Between Slides"
        step={timeBetweenSlidesStep}
        onStepChange={setTimeBetweenSlidesStep}
        startValue={timeBetweenSlidesDefault ?? drillDJDefaults.defaultValues.timeBetweenSlides}
        onStartValueChange={setTimeBetweenSlidesDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
      />
      <SettingGroup
        title="Float Time"
        step={floatTimeStep}
        onStepChange={setFloatTimeStep}
        startValue={floatTimeDefault ?? drillDJDefaults.defaultValues.floatTime}
        onStartValueChange={setFloatTimeDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
      />
      <SettingGroup
        title="Time Between Floats"
        step={timeBetweenFloatsStep}
        onStepChange={setTimeBetweenFloatsStep}
        startValue={timeBetweenFloatsDefault ?? drillDJDefaults.defaultValues.timeBetweenFloats}
        onStartValueChange={setTimeBetweenFloatsDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
      />
      <SettingGroup
        title="Switch Time"
        step={switchTimeStep}
        onStepChange={setSwitchTimeStep}
        startValue={switchTimeDefault ?? drillDJDefaults.defaultValues.switchTime}
        onStartValueChange={setSwitchTimeDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
      />
      <SettingGroup
        title="Time Between Switches"
        step={timeBetweenSwitchesStep}
        onStepChange={setTimeBetweenSwitchesStep}
        startValue={timeBetweenSwitchesDefault ?? drillDJDefaults.defaultValues.timeBetweenSwitches}
        onStartValueChange={setTimeBetweenSwitchesDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
      />
      <SettingGroup
        title="Get Ready Time"
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? drillDJDefaults.defaultValues.getReadyTime}
        onStartValueChange={setGetReadyDefault}
        minLimit={SHARED_FIELD_LIMITS.getReadyTime.minLimit}
      />
      <SettingGroup
        title="Sets"
        step={numSetsStep}
        onStepChange={setNumSetsStep}
        startValue={numSetsDefault ?? drillDJDefaults.defaultValues.numSets}
        onStartValueChange={setNumSetsDefault}
        minLimit={SHARED_FIELD_LIMITS.numSets.minLimit}
      />
      <SettingGroup
        title="Rest Time"
        step={restTimeStep}
        onStepChange={setRestTimeStep}
        startValue={restTimeDefault ?? drillDJDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
      />
    </SettingsScreenLayout>
  )
}
