import { useState } from 'react'
import { SettingsScreenLayout } from '../components/settings-screen-layout'
import { SettingGroup } from '../components/setting-group'
import {
  holdOnDefaults,
  SHARED_FIELD_LIMITS,
  HOLD_TIME_LIMITS,
} from '../services/holdOn.settings.service'

export function HoldOnSettingsScreen() {
  const { inputSettings, defaultValues } = holdOnDefaults

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

  function handleSave() {
    // Placeholder: no backend yet
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
        startValue={holdTimeDefault}
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
        startValue={getReadyDefault}
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
        startValue={numSetsDefault}
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
        startValue={restTimeDefault}
        onStartValueChange={setRestTimeDefault}
        minLimit={SHARED_FIELD_LIMITS.restTime.minLimit}
        maxLimit={SHARED_FIELD_LIMITS.restTime.maxLimit}
      />
    </SettingsScreenLayout>
  )
}
