import { StyleSheet, Text, View, TouchableOpacity, TextInput, Switch, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { inputContainerStyle } from '../theme/input-styles'
import type { CueStep } from '../services/cueCraft.types'
import { cueCraftDefaults } from '../services/cueCraft.settings.service'

interface CueStepRowProps {
  step: CueStep
  index: number
  total: number
  onUpdate: (step: CueStep) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  disabled?: boolean
  /** Step increments from CueCraft settings. Uses defaults when not provided. */
  inputSettings?: typeof cueCraftDefaults.inputSettings
}

const STEP_LABELS: Record<string, string> = {
  getReady: 'Get ready',
  timer: 'Timer',
  rest: 'Rest',
  reps: 'Reps',
  sets: 'Sets',
  customText: 'Custom',
}

const STEP_HINTS: Record<string, string> = {
  reps: 'Repeats the following steps',
  sets: 'Repeats the whole sequence',
}

export function CueStepRow({
  step,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled = false,
  inputSettings: is = cueCraftDefaults.inputSettings,
}: CueStepRowProps) {
  const label = STEP_LABELS[step.type] ?? step.type
  const hint = STEP_HINTS[step.type]

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.index}>{index + 1}</Text>
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{label}</Text>
          {hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            disabled={disabled || index === 0}
            onPress={onMoveUp}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-up" size={22} color={index === 0 ? '#ccc' : '#5B9A8B'} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disabled || index >= total - 1}
            onPress={onMoveDown}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-down"
              size={22}
              color={index >= total - 1 ? '#ccc' : '#5B9A8B'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disabled}
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color={disabled ? '#ccc' : '#c53030'} />
          </TouchableOpacity>
        </View>
      </View>

      {(step.type === 'getReady' || step.type === 'rest') && (
        <View style={styles.durationRow}>
          <Text style={styles.durationLabel}>Duration (sec)</Text>
          <View style={styles.durationControls}>
            <TouchableOpacity
              disabled={disabled}
              onPress={() =>
                onUpdate({
                  ...step,
                  duration: Math.max(
                    step.type === 'getReady' ? is.getReadyTime.min : is.restDuration.min,
                    step.duration - (step.type === 'getReady' ? is.getReadyTime.step : is.restDuration.step)
                  ),
                } as CueStep)
              }
            >
              <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.duration}</Text>
            <TouchableOpacity
              disabled={disabled}
              onPress={() =>
                onUpdate({
                  ...step,
                  duration: step.duration + (step.type === 'getReady' ? is.getReadyTime.step : is.restDuration.step),
                } as CueStep)
              }
            >
              <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step.type === 'timer' && (
        <View style={styles.timerRow}>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Duration (sec)</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                  const newDuration = Math.max(is.timerDuration.min, step.duration - is.timerDuration.step)
                  const currentCountdown = step.countdownFrom ?? 10
                  onUpdate({
                    ...step,
                    duration: newDuration,
                    calloutInterval: Math.max(1, Math.floor(newDuration / 2)),
                    countdownFrom: Math.min(currentCountdown, newDuration),
                  })
                }}
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.duration}</Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                  const newDuration = step.duration + is.timerDuration.step
                  onUpdate({
                    ...step,
                    duration: newDuration,
                    calloutInterval: Math.max(1, Math.floor(newDuration / 2)),
                  })
                }}
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Callout every (sec)</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() =>
                  onUpdate({
                    ...step,
                    calloutInterval: Math.max(
                      0,
                      (step.calloutInterval ?? Math.max(1, Math.floor(step.duration / 2))) - is.timerDuration.step
                    ),
                  })
                }
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.value, disabled && styles.valueDisabled]}>
                {step.calloutInterval ?? Math.max(1, Math.floor(step.duration / 2))}
              </Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() =>
                  onUpdate({
                    ...step,
                    calloutInterval: Math.min(
                      step.duration,
                      (step.calloutInterval ?? Math.max(1, Math.floor(step.duration / 2))) + is.timerDuration.step
                    ),
                  })
                }
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Countdown from</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() =>
                  onUpdate({
                    ...step,
                    countdownFrom: Math.max(0, (step.countdownFrom ?? 10) - 1),
                  })
                }
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.value, disabled && styles.valueDisabled]}>
                {step.countdownFrom ?? 10}
              </Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() =>
                  onUpdate({
                    ...step,
                    countdownFrom: Math.min(
                      step.duration,
                      (step.countdownFrom ?? 10) + 1
                    ),
                  })
                }
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {step.type === 'reps' && (
        <View style={styles.repsRow}>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Count</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() =>
                  onUpdate({ ...step, count: Math.max(is.repsCount.min, step.count - is.repsCount.step) })
                }
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.count}</Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => onUpdate({ ...step, count: step.count + is.repsCount.step })}
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Say reps</Text>
            <View style={Platform.OS === 'ios' ? styles.switchWrapperIOS : undefined}>
              <Switch
                value={step.announceReps ?? false}
                onValueChange={(v) => onUpdate({ ...step, announceReps: v })}
                disabled={disabled}
                trackColor={{ false: '#d1d5db', true: '#5B9A8B' }}
                thumbColor="#fff"
                style={Platform.OS === 'ios' ? styles.switchIOS : undefined}
              />
            </View>
          </View>
        </View>
      )}

      {step.type === 'sets' && (
        <View style={styles.setsRow}>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Sets</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() =>
                  onUpdate({ ...step, count: Math.max(is.setsCount.min, step.count - is.setsCount.step) })
                }
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.count}</Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => onUpdate({ ...step, count: step.count + is.setsCount.step })}
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {step.count >= 2 && (
            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Rest between (sec)</Text>
              <View style={styles.durationControls}>
                <TouchableOpacity
                  disabled={disabled}
                  onPress={() =>
                    onUpdate({
                      ...step,
                      restBetween: Math.max(is.setsRestBetween.min, step.restBetween - is.setsRestBetween.step),
                    })
                  }
                >
                  <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.restBetween}</Text>
                <TouchableOpacity
                  disabled={disabled}
                  onPress={() =>
                    onUpdate({ ...step, restBetween: step.restBetween + is.setsRestBetween.step })
                  }
                >
                  <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {step.type === 'customText' && (
        <TextInput
          style={[styles.textInput, disabled && styles.textInputDisabled]}
          placeholder="What should the voice say?"
          placeholderTextColor="#999"
          value={step.text}
          onChangeText={(text) => onUpdate({ ...step, text })}
          editable={!disabled}
          multiline
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...inputContainerStyle,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  index: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#5B9A8B',
  },
  labelWrap: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setsRow: {
    gap: 8,
  },
  repsRow: {
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
  },
  switchWrapperIOS: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchIOS: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  timerRow: {
    gap: 8,
  },
  durationLabel: {
    fontSize: 14,
    color: '#666',
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5B9A8B',
    paddingHorizontal: 12,
  },
  btnDisabled: { color: '#999' },
  value: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'center',
    color: '#374151',
  },
  valueDisabled: { color: '#999' },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#374151',
    minHeight: 44,
  },
  textInputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#999',
  },
})
