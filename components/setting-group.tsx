import { StyleSheet, Text, View } from 'react-native'
import { NumberInput } from './number-input'

export interface SettingGroupProps {
  title: string
  range: [number, number]
  onRangeChange: (range: [number, number]) => void
  step: number
  onStepChange: (step: number) => void
  startValue: number
  onStartValueChange: (value: number) => void
  minLimit: number
  maxLimit: number
  startLabel?: string
}

/**
 * A settings group with range (min/max), step, and start value.
 * Mirrors the frontend SettingGroup structure.
 */
export function SettingGroup({
  title,
  range,
  onRangeChange,
  step,
  onStepChange,
  startValue,
  onStartValueChange,
  minLimit,
  maxLimit,
  startLabel = 'Start Value',
}: SettingGroupProps) {
  const [min, max] = range

  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>

      <View style={styles.row}>
        <View style={styles.half}>
          <NumberInput
            label="Min"
            value={min}
            onDecrease={() => onRangeChange([Math.max(minLimit, min - step), max])}
            onIncrease={() => onRangeChange([Math.min(max - step, min + step), max])}
          />
        </View>
        <View style={styles.half}>
          <NumberInput
            label="Max"
            value={max}
            onDecrease={() => onRangeChange([min, Math.max(min + step, max - step)])}
            onIncrease={() => onRangeChange([min, Math.min(maxLimit, max + step)])}
          />
        </View>
      </View>

      <View style={[styles.row, styles.lastRow]}>
        <View style={styles.half}>
          <NumberInput
            label="Step"
            value={step}
            onDecrease={() => onStepChange(Math.max(1, step - 1))}
            onIncrease={() => onStepChange(Math.min(max - min, step + 1))}
          />
        </View>
        <View style={styles.half}>
          <NumberInput
            label={startLabel}
            value={startValue}
            onDecrease={() => {
              const next = Math.max(min, startValue - step)
              onStartValueChange(Math.min(max, next))
            }}
            onIncrease={() => {
              const next = Math.min(max, startValue + step)
              onStartValueChange(Math.max(min, next))
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  lastRow: { marginBottom: 0 },
  half: { flex: 1, minWidth: 0 },
})
