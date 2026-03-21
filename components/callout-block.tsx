import { ReactNode } from 'react'
import { SelectInput, type SelectOption } from './select-input'
import { NumberInput } from './number-input'
import type { CalloutConfig } from '../services/drillDJ.service'

const CALLOUT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'switch', label: 'Switch Legs' },
  { value: 'both', label: 'Both Legs' },
]

const NESTED_SWITCH_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'both', label: 'Both Legs' },
]

const NESTED_BOTH_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'switch', label: 'Switch Legs' },
]

interface CalloutBlockProps {
  callout: CalloutConfig
  onChange: (callout: CalloutConfig) => void
  disabled?: boolean
  numRepsMin?: number
  numRepsStep?: number
  asGridItems?: boolean
  GridItem?: (props: { children: ReactNode }) => ReactNode
}

export function CalloutBlock({
  callout,
  onChange,
  disabled = false,
  numRepsMin = 1,
  numRepsStep = 1,
  asGridItems = false,
  GridItem: GridItemComp,
}: CalloutBlockProps) {
  const { type, afterReps = 3, nested = {} } = callout
  const showNested = type === 'switch' || type === 'both'
  const nestedOptions = type === 'switch' ? NESTED_SWITCH_OPTIONS : NESTED_BOTH_OPTIONS
  const showNestedReps = nested?.type !== 'none'

  function updateType(newType: 'none' | 'switch' | 'both') {
    onChange({
      type: newType,
      afterReps,
      nested: { type: 'none', afterReps },
    })
  }

  function updateNestedType(newNestedType: 'none' | 'switch' | 'both') {
    onChange({
      ...callout,
      nested: { ...nested, type: newNestedType, afterReps: nested?.afterReps ?? afterReps },
    })
  }

  const wrap = (node: ReactNode) =>
    asGridItems && GridItemComp ? <GridItemComp>{node}</GridItemComp> : node

  return (
    <>
      {wrap(
        <SelectInput
          label="More cues"
          options={CALLOUT_TYPE_OPTIONS}
          value={type}
          onChange={(v) => updateType(v as 'none' | 'switch' | 'both')}
          disabled={disabled}
        />
      )}
      {type !== 'none' &&
        wrap(
          <NumberInput
            label="# of reps"
            value={afterReps}
            onDecrease={() =>
              onChange({
                ...callout,
                afterReps: Math.max(numRepsMin, afterReps - numRepsStep),
              })
            }
            onIncrease={() =>
              onChange({
                ...callout,
                afterReps: afterReps + numRepsStep,
              })
            }
            disabled={disabled}
          />
        )}
      {showNested &&
        wrap(
          <SelectInput
            label="Then"
            options={nestedOptions}
            value={nested?.type ?? 'none'}
            onChange={(v) => updateNestedType(v as 'none' | 'switch' | 'both')}
            disabled={disabled}
          />
        )}
      {showNestedReps &&
        wrap(
          <NumberInput
            label="# of reps"
            value={nested?.afterReps ?? afterReps}
            onDecrease={() =>
              onChange({
                ...callout,
                nested: {
                  ...nested,
                  afterReps: Math.max(
                    numRepsMin,
                    (nested?.afterReps ?? afterReps) - numRepsStep
                  ),
                },
              })
            }
            onIncrease={() =>
              onChange({
                ...callout,
                nested: {
                  ...nested,
                  afterReps: (nested?.afterReps ?? afterReps) + numRepsStep,
                },
              })
            }
            disabled={disabled}
          />
        )}
    </>
  )
}
