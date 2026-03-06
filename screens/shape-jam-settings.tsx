import { useState, useEffect } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import { ShapeListSettings } from '../components/shape-list-settings'
import {
  shapeJamDefaults,
  SHARED_FIELD_LIMITS,
  HOLD_TIME_LIMITS,
  getFeatureInputSettings,
  type ShapeJamUserSettings,
} from '../services/shapeJam.settings.service'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, upsertProfile } from '../services/profile.service'

export function ShapeJamSettingsScreen() {
  const navigation = useNavigation<any>()
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { inputSettings: is0, defaultValues: dv0 } = getFeatureInputSettings(undefined, shapeJamDefaults)
  const inputSettings = { ...shapeJamDefaults.inputSettings, ...is0 }
  const defaultValues = { ...shapeJamDefaults.defaultValues, ...dv0 }

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

  const [holdTimeRange, setHoldTimeRange] = useState<[number, number]>([
    inputSettings.holdTime.min,
    inputSettings.holdTime.max,
  ])
  const [holdTimeStep, setHoldTimeStep] = useState(inputSettings.holdTime.step)
  const [holdTimeDefault, setHoldTimeDefault] = useState(defaultValues.holdTime)

  const defaultShapeSet = new Set<string>(shapeJamDefaults.inputSettings.shapes)
  const customShapesFromUser = (inputSettings.shapes ?? []).filter(
    (s: string) => !defaultShapeSet.has(s)
  )
  const [customShapes, setCustomShapes] = useState<string[]>(customShapesFromUser)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    getProfile(session.user.id)
      .then((p) => {
        const userSettings = (p?.settings as Record<string, unknown>)?.shapeJam as ShapeJamUserSettings | undefined
        const { inputSettings: is, defaultValues: dv } = getFeatureInputSettings(userSettings, shapeJamDefaults)
        const mergedInput = { ...shapeJamDefaults.inputSettings, ...is }
        const mergedDef = { ...shapeJamDefaults.defaultValues, ...dv }
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
        const custom = (mergedInput.shapes ?? []).filter(
          (s: string) => !defaultShapeSet.has(s)
        )
        setCustomShapes(custom)
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
      const shapeJamSettings = {
        inputSettings: {
          getReadyTime: { min: getReadyRange[0], max: getReadyRange[1], step: getReadyStep },
          numSets: { min: numSetsRange[0], max: numSetsRange[1], step: numSetsStep },
          restTime: { min: restTimeRange[0], max: restTimeRange[1], step: restTimeStep },
          holdTime: { min: holdTimeRange[0], max: holdTimeRange[1], step: holdTimeStep },
          shapes: [...shapeJamDefaults.inputSettings.shapes, ...customShapes],
        },
        defaultValues: {
          getReadyTime: getReadyDefault,
          numSets: numSetsDefault,
          restTime: restTimeDefault,
          holdTime: holdTimeDefault,
        },
      }
      await upsertProfile(session.user.id, {
        settings: { ...currentSettings, shapeJam: shapeJamSettings },
      })
      Alert.alert('Saved', 'ShapeJam settings saved successfully.')
      navigation.goBack()
    } catch (err: unknown) {
      Alert.alert('Error', (err as Error)?.message ?? 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setGetReadyRange([shapeJamDefaults.inputSettings.getReadyTime.min, shapeJamDefaults.inputSettings.getReadyTime.max])
    setGetReadyStep(shapeJamDefaults.inputSettings.getReadyTime.step)
    setGetReadyDefault(shapeJamDefaults.defaultValues.getReadyTime)

    setNumSetsRange([shapeJamDefaults.inputSettings.numSets.min, shapeJamDefaults.inputSettings.numSets.max])
    setNumSetsStep(shapeJamDefaults.inputSettings.numSets.step)
    setNumSetsDefault(shapeJamDefaults.defaultValues.numSets)

    setRestTimeRange([shapeJamDefaults.inputSettings.restTime.min, shapeJamDefaults.inputSettings.restTime.max])
    setRestTimeStep(shapeJamDefaults.inputSettings.restTime.step)
    setRestTimeDefault(shapeJamDefaults.defaultValues.restTime)

    setHoldTimeRange([shapeJamDefaults.inputSettings.holdTime.min, shapeJamDefaults.inputSettings.holdTime.max])
    setHoldTimeStep(shapeJamDefaults.inputSettings.holdTime.step)
    setHoldTimeDefault(shapeJamDefaults.defaultValues.holdTime)

    setCustomShapes([])
  }

  if (loading) {
    return (
      <SettingsScreenLayout title="ShapeJam" onSave={() => {}} onReset={() => {}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color="#5B9A8B" />
        </View>
      </SettingsScreenLayout>
    )
  }

  return (
    <SettingsScreenLayout
      title="ShapeJam"
      onSave={handleSave}
      onReset={handleReset}
    >
      <SettingGroup
        title="Hold Time (per shape)"
        range={holdTimeRange}
        onRangeChange={setHoldTimeRange}
        step={holdTimeStep}
        onStepChange={setHoldTimeStep}
        startValue={holdTimeDefault ?? shapeJamDefaults.defaultValues.holdTime}
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
        startValue={getReadyDefault ?? shapeJamDefaults.defaultValues.getReadyTime}
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
        startValue={numSetsDefault ?? shapeJamDefaults.defaultValues.numSets}
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
        startValue={restTimeDefault ?? shapeJamDefaults.defaultValues.restTime}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.restTime.maxLimit}
      />

      <ShapeListSettings
        customShapes={customShapes}
        setCustomShapes={setCustomShapes}
      />
    </SettingsScreenLayout>
  )
}
