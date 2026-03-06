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

  const [getReadyRange, setGetReadyRange] = useState<[number, number]>([
    inputSettings.getReadyTime.min,
    inputSettings.getReadyTime.max,
  ])
  const [getReadyStep, setGetReadyStep] = useState(inputSettings.getReadyTime.step)
  const [getReadyDefault, setGetReadyDefault] = useState(defaultValues.getReadyTime)

  const [numSetsRange, setNumSetsRange] = useState<[number, number]>([
    inputSettings.numSets.min,
    inputSettings.numSets.max,
  ])
  const [numSetsStep, setNumSetsStep] = useState(inputSettings.numSets.step)
  const [numSetsDefault, setNumSetsDefault] = useState(defaultValues.numSets)

  const [restTimeRange, setRestTimeRange] = useState<[number, number]>([
    inputSettings.restTime.min,
    inputSettings.restTime.max,
  ])
  const [restTimeStep, setRestTimeStep] = useState(inputSettings.restTime.step)
  const [restTimeDefault, setRestTimeDefault] = useState(defaultValues.restTime)

  const [slideTimeRange, setSlideTimeRange] = useState<[number, number]>([
    inputSettings.slideTime.min,
    inputSettings.slideTime.max,
  ])
  const [slideTimeStep, setSlideTimeStep] = useState(inputSettings.slideTime.step)
  const [slideTimeDefault, setSlideTimeDefault] = useState(defaultValues.slideTime)

  const [timeBetweenSlidesRange, setTimeBetweenSlidesRange] = useState<[number, number]>([
    inputSettings.timeBetweenSlides.min,
    inputSettings.timeBetweenSlides.max,
  ])
  const [timeBetweenSlidesStep, setTimeBetweenSlidesStep] = useState(inputSettings.timeBetweenSlides.step)
  const [timeBetweenSlidesDefault, setTimeBetweenSlidesDefault] = useState(defaultValues.timeBetweenSlides)

  const [floatTimeRange, setFloatTimeRange] = useState<[number, number]>([
    inputSettings.floatTime.min,
    inputSettings.floatTime.max,
  ])
  const [floatTimeStep, setFloatTimeStep] = useState(inputSettings.floatTime.step)
  const [floatTimeDefault, setFloatTimeDefault] = useState(defaultValues.floatTime)

  const [timeBetweenFloatsRange, setTimeBetweenFloatsRange] = useState<[number, number]>([
    inputSettings.timeBetweenFloats.min,
    inputSettings.timeBetweenFloats.max,
  ])
  const [timeBetweenFloatsStep, setTimeBetweenFloatsStep] = useState(inputSettings.timeBetweenFloats.step)
  const [timeBetweenFloatsDefault, setTimeBetweenFloatsDefault] = useState(defaultValues.timeBetweenFloats)

  const [switchTimeRange, setSwitchTimeRange] = useState<[number, number]>([
    inputSettings.switchTime.min,
    inputSettings.switchTime.max,
  ])
  const [switchTimeStep, setSwitchTimeStep] = useState(inputSettings.switchTime.step)
  const [switchTimeDefault, setSwitchTimeDefault] = useState(defaultValues.switchTime)

  const [timeBetweenSwitchesRange, setTimeBetweenSwitchesRange] = useState<[number, number]>([
    inputSettings.timeBetweenSwitches.min,
    inputSettings.timeBetweenSwitches.max,
  ])
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
        setGetReadyRange([mergedInput.getReadyTime.min, mergedInput.getReadyTime.max])
        setGetReadyStep(mergedInput.getReadyTime.step)
        setGetReadyDefault(mergedDef.getReadyTime)
        setNumSetsRange([mergedInput.numSets.min, mergedInput.numSets.max])
        setNumSetsStep(mergedInput.numSets.step)
        setNumSetsDefault(mergedDef.numSets)
        setRestTimeRange([mergedInput.restTime.min, mergedInput.restTime.max])
        setRestTimeStep(mergedInput.restTime.step)
        setRestTimeDefault(mergedDef.restTime)
        setSlideTimeRange([mergedInput.slideTime.min, mergedInput.slideTime.max])
        setSlideTimeStep(mergedInput.slideTime.step)
        setSlideTimeDefault(mergedDef.slideTime)
        setTimeBetweenSlidesRange([mergedInput.timeBetweenSlides.min, mergedInput.timeBetweenSlides.max])
        setTimeBetweenSlidesStep(mergedInput.timeBetweenSlides.step)
        setTimeBetweenSlidesDefault(mergedDef.timeBetweenSlides)
        setFloatTimeRange([mergedInput.floatTime.min, mergedInput.floatTime.max])
        setFloatTimeStep(mergedInput.floatTime.step)
        setFloatTimeDefault(mergedDef.floatTime)
        setTimeBetweenFloatsRange([mergedInput.timeBetweenFloats.min, mergedInput.timeBetweenFloats.max])
        setTimeBetweenFloatsStep(mergedInput.timeBetweenFloats.step)
        setTimeBetweenFloatsDefault(mergedDef.timeBetweenFloats)
        setSwitchTimeRange([mergedInput.switchTime.min, mergedInput.switchTime.max])
        setSwitchTimeStep(mergedInput.switchTime.step)
        setSwitchTimeDefault(mergedDef.switchTime)
        setTimeBetweenSwitchesRange([mergedInput.timeBetweenSwitches.min, mergedInput.timeBetweenSwitches.max])
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
          getReadyTime: { min: getReadyRange[0], max: getReadyRange[1], step: getReadyStep },
          numSets: { min: numSetsRange[0], max: numSetsRange[1], step: numSetsStep },
          restTime: { min: restTimeRange[0], max: restTimeRange[1], step: restTimeStep },
          slideTime: { min: slideTimeRange[0], max: slideTimeRange[1], step: slideTimeStep },
          timeBetweenSlides: { min: timeBetweenSlidesRange[0], max: timeBetweenSlidesRange[1], step: timeBetweenSlidesStep },
          floatTime: { min: floatTimeRange[0], max: floatTimeRange[1], step: floatTimeStep },
          timeBetweenFloats: { min: timeBetweenFloatsRange[0], max: timeBetweenFloatsRange[1], step: timeBetweenFloatsStep },
          switchTime: { min: switchTimeRange[0], max: switchTimeRange[1], step: switchTimeStep },
          timeBetweenSwitches: { min: timeBetweenSwitchesRange[0], max: timeBetweenSwitchesRange[1], step: timeBetweenSwitchesStep },
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
    setGetReadyRange([drillDJDefaults.inputSettings.getReadyTime.min, drillDJDefaults.inputSettings.getReadyTime.max])
    setGetReadyStep(drillDJDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(drillDJDefaults.defaultValues.getReadyTime)
    setNumSetsRange([drillDJDefaults.inputSettings.numSets.min, drillDJDefaults.inputSettings.numSets.max])
    setNumSetsStep(drillDJDefaults.inputSettings.numSets.step)
    setNumSetsDefault(drillDJDefaults.defaultValues.numSets)
    setRestTimeRange([drillDJDefaults.inputSettings.restTime.min, drillDJDefaults.inputSettings.restTime.max])
    setRestTimeStep(drillDJDefaults.inputSettings.restTime.step)
    setRestTimeDefault(drillDJDefaults.defaultValues.restTime)
    setSlideTimeRange([drillDJDefaults.inputSettings.slideTime.min, drillDJDefaults.inputSettings.slideTime.max])
    setSlideTimeStep(drillDJDefaults.inputSettings.slideTime.step)
    setSlideTimeDefault(drillDJDefaults.defaultValues.slideTime)
    setTimeBetweenSlidesRange([drillDJDefaults.inputSettings.timeBetweenSlides.min, drillDJDefaults.inputSettings.timeBetweenSlides.max])
    setTimeBetweenSlidesStep(drillDJDefaults.inputSettings.timeBetweenSlides.step)
    setTimeBetweenSlidesDefault(drillDJDefaults.defaultValues.timeBetweenSlides)
    setFloatTimeRange([drillDJDefaults.inputSettings.floatTime.min, drillDJDefaults.inputSettings.floatTime.max])
    setFloatTimeStep(drillDJDefaults.inputSettings.floatTime.step)
    setFloatTimeDefault(drillDJDefaults.defaultValues.floatTime)
    setTimeBetweenFloatsRange([drillDJDefaults.inputSettings.timeBetweenFloats.min, drillDJDefaults.inputSettings.timeBetweenFloats.max])
    setTimeBetweenFloatsStep(drillDJDefaults.inputSettings.timeBetweenFloats.step)
    setTimeBetweenFloatsDefault(drillDJDefaults.defaultValues.timeBetweenFloats)
    setSwitchTimeRange([drillDJDefaults.inputSettings.switchTime.min, drillDJDefaults.inputSettings.switchTime.max])
    setSwitchTimeStep(drillDJDefaults.inputSettings.switchTime.step)
    setSwitchTimeDefault(drillDJDefaults.defaultValues.switchTime)
    setTimeBetweenSwitchesRange([drillDJDefaults.inputSettings.timeBetweenSwitches.min, drillDJDefaults.inputSettings.timeBetweenSwitches.max])
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
        range={slideTimeRange}
        onRangeChange={setSlideTimeRange}
        step={slideTimeStep}
        onStepChange={setSlideTimeStep}
        startValue={slideTimeDefault ?? drillDJDefaults.defaultValues.slideTime}
        onStartValueChange={setSlideTimeDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
        maxLimit={DRILL_TIME_LIMITS.maxLimit}
      />
      <SettingGroup
        title="Time Between Slides"
        range={timeBetweenSlidesRange}
        onRangeChange={setTimeBetweenSlidesRange}
        step={timeBetweenSlidesStep}
        onStepChange={setTimeBetweenSlidesStep}
        startValue={timeBetweenSlidesDefault ?? drillDJDefaults.defaultValues.timeBetweenSlides}
        onStartValueChange={setTimeBetweenSlidesDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
        maxLimit={DRILL_TIME_LIMITS.maxLimit}
      />
      <SettingGroup
        title="Float Time"
        range={floatTimeRange}
        onRangeChange={setFloatTimeRange}
        step={floatTimeStep}
        onStepChange={setFloatTimeStep}
        startValue={floatTimeDefault ?? drillDJDefaults.defaultValues.floatTime}
        onStartValueChange={setFloatTimeDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
        maxLimit={DRILL_TIME_LIMITS.maxLimit}
      />
      <SettingGroup
        title="Time Between Floats"
        range={timeBetweenFloatsRange}
        onRangeChange={setTimeBetweenFloatsRange}
        step={timeBetweenFloatsStep}
        onStepChange={setTimeBetweenFloatsStep}
        startValue={timeBetweenFloatsDefault ?? drillDJDefaults.defaultValues.timeBetweenFloats}
        onStartValueChange={setTimeBetweenFloatsDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
        maxLimit={DRILL_TIME_LIMITS.maxLimit}
      />
      <SettingGroup
        title="Switch Time"
        range={switchTimeRange}
        onRangeChange={setSwitchTimeRange}
        step={switchTimeStep}
        onStepChange={setSwitchTimeStep}
        startValue={switchTimeDefault ?? drillDJDefaults.defaultValues.switchTime}
        onStartValueChange={setSwitchTimeDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
        maxLimit={DRILL_TIME_LIMITS.maxLimit}
      />
      <SettingGroup
        title="Time Between Switches"
        range={timeBetweenSwitchesRange}
        onRangeChange={setTimeBetweenSwitchesRange}
        step={timeBetweenSwitchesStep}
        onStepChange={setTimeBetweenSwitchesStep}
        startValue={timeBetweenSwitchesDefault ?? drillDJDefaults.defaultValues.timeBetweenSwitches}
        onStartValueChange={setTimeBetweenSwitchesDefault}
        minLimit={DRILL_TIME_LIMITS.minLimit}
        maxLimit={DRILL_TIME_LIMITS.maxLimit}
      />
      <SettingGroup
        title="Get Ready Time"
        range={getReadyRange}
        onRangeChange={setGetReadyRange}
        step={getReadyStep}
        onStepChange={setGetReadyStep}
        startValue={getReadyDefault ?? drillDJDefaults.defaultValues.getReadyTime}
        onStartValueChange={setGetReadyDefault}
        minLimit={SHARED_FIELD_LIMITS.getReadyTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.getReadyTime.maxLimit}
      />
      <SettingGroup
        title="Sets"
        range={numSetsRange}
        onRangeChange={setNumSetsRange}
        step={numSetsStep}
        onStepChange={setNumSetsStep}
        startValue={numSetsDefault ?? drillDJDefaults.defaultValues.numSets}
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
        startValue={restTimeDefault ?? drillDJDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.restTime.maxLimit}
      />
    </SettingsScreenLayout>
  )
}
