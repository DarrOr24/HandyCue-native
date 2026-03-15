import { StyleSheet, Text, View } from 'react-native'
import { NumberInput } from './number-input'
import { decrementFloor } from '../theme/input-styles'

export interface SettingGroupProps {
  title: string
  step: number
  onStepChange: (step: number) => void
  startValue: number
  onStartValueChange: (value: number) => void
  minLimit: number
  startLabel?: string
}

/**
 * A settings group with increment (step) and default starting value.
 * Min is enforced as floor; no max limit.
 */
export function SettingGroup({
  title,
  step,
  onStepChange,
  startValue,
  onStartValueChange,
  minLimit,
  startLabel = 'Default',
}: SettingGroupProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>

      <View style={styles.row}>
        <View style={styles.half}>
          <NumberInput
            label="Increment"
            value={step}
            onDecrease={() => onStepChange(Math.max(1, step - 1))}
            onIncrease={() => onStepChange(step + 1)}
          />
        </View>
        <View style={styles.half}>
          <NumberInput
            label={startLabel}
            value={startValue}
            onDecrease={() => onStartValueChange(Math.max(decrementFloor(minLimit, step), startValue - step))}
            onIncrease={() => onStartValueChange(startValue + step)}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 28,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  lastRow: { marginBottom: 0 },
  half: { flex: 1, minWidth: 0 },
})
