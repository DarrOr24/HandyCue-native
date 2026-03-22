import { StyleSheet, Text, View, TouchableOpacity, TextInput, Switch, Platform, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { inputContainerStyle, decrementFloor } from '../theme/input-styles'
import type { CueStep, CustomTextStep } from '../services/cueCraft.types'
import { cueCraftDefaults } from '../services/cueCraft.settings.service'

interface CueStepRowProps {
  step: CueStep
  index: number
  total: number
  onUpdate: (step: CueStep) => void
  onRemove: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  disabled?: boolean
  /** Step increments from CueCraft settings. Uses defaults when not provided. */
  inputSettings?: typeof cueCraftDefaults.inputSettings
}

const STEP_LABELS: Record<string, string> = {
  getReady: 'Get ready',
  reps: 'Reps',
  sets: 'Sets',
  customText: 'Audio Cue',
}

/** Explanations only in AddStepModal; not shown on cards to save space */
const STEP_HINTS: Record<string, string> = {}

/** Default callout: no callout for holds ≤24 sec, else 10 sec. */
function defaultCalloutInterval(duration: number): number {
  return duration <= 24 ? 0 : 10
}

function effectiveCalloutInterval(step: { duration: number; calloutInterval?: number }): number {
  return step.calloutInterval ?? defaultCalloutInterval(step.duration)
}


export function CueStepRow({
  step,
  index,
  total,
  onUpdate,
  onRemove,
  onDuplicate,
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
        <Text style={styles.index} numberOfLines={1}>{index + 1}</Text>
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
            onPress={onDuplicate}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="copy-outline" size={20} color={disabled ? '#ccc' : '#5B9A8B'} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disabled}
            onPress={() => {
              Alert.alert(
                'Delete step?',
                'Are you sure you want to remove this step?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: onRemove },
                ]
              )
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color={disabled ? '#ccc' : '#c53030'} />
          </TouchableOpacity>
        </View>
      </View>

      {step.type === 'getReady' && (
        <View style={styles.durationRow}>
          <Text style={styles.durationLabel}>Duration</Text>
          <View style={styles.durationControls}>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => {
                const cfg = is.getReadyTime
                const floor = decrementFloor(cfg.min, cfg.step)
                onUpdate({
                  ...step,
                  duration: Math.max(floor, step.duration - cfg.step),
                })
              }}
            >
              <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.duration}</Text>
            <TouchableOpacity
              disabled={disabled}
              onPress={() =>
                onUpdate({
                  ...step,
                  duration: step.duration + is.getReadyTime.step,
                })
              }
            >
              <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
            </TouchableOpacity>
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
                  onUpdate({ ...step, count: Math.max(decrementFloor(is.repsCount.min, is.repsCount.step), step.count - is.repsCount.step) })
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
                  onUpdate({ ...step, count: Math.max(decrementFloor(is.setsCount.min, is.setsCount.step), step.count - is.setsCount.step) })
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
            <>
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Rest</Text>
                <View style={styles.durationControls}>
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={() => {
                      const floor = decrementFloor(is.setsRestBetween.min, is.setsRestBetween.step)
                      onUpdate({
                        ...step,
                        restBetween: Math.max(floor, step.restBetween - is.setsRestBetween.step),
                      })
                    }}
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
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Say countdown</Text>
                <View style={Platform.OS === 'ios' ? styles.switchWrapperIOS : undefined}>
                  <Switch
                    value={step.announceRestCountdown ?? true}
                    onValueChange={(v) => onUpdate({ ...step, announceRestCountdown: v })}
                    disabled={disabled}
                    trackColor={{ false: '#d1d5db', true: '#5B9A8B' }}
                    thumbColor="#fff"
                    style={Platform.OS === 'ios' ? styles.switchIOS : undefined}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      )}

      {step.type === 'customText' && (
        <View style={styles.audioCueRow}>
          <TextInput
            style={[styles.textInput, disabled && styles.textInputDisabled]}
            placeholder="What should the voice say?"
            placeholderTextColor="#999"
            value={step.text}
            onChangeText={(text) => onUpdate({ ...step, text })}
            editable={!disabled}
            multiline
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
          />
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Duration</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                  const dur = step.duration ?? 0
                  const newDuration = Math.max(0, dur - is.duration.step)
                  const currentCountdown = step.countdownFrom ?? 10
                  onUpdate({
                    ...step,
                    duration: newDuration,
                    calloutInterval: newDuration > 0 ? defaultCalloutInterval(newDuration) : undefined,
                    countdownFrom: newDuration > 0 ? Math.min(currentCountdown, newDuration) : undefined,
                  } as CustomTextStep)
                }}
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.value, disabled && styles.valueDisabled]}>{step.duration ?? 0}</Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                  const dur = step.duration ?? 0
                  const newDuration = dur + is.duration.step
                  const currentCountdown = step.countdownFrom ?? 10
                  onUpdate({
                    ...step,
                    duration: newDuration,
                    calloutInterval: defaultCalloutInterval(newDuration),
                    countdownFrom: Math.min(currentCountdown, newDuration),
                  } as CustomTextStep)
                }}
              >
                <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {(step.duration ?? 0) > 0 && (
            <>
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Callout</Text>
                <View style={styles.durationControls}>
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={() =>
                      onUpdate({
                        ...step,
                        calloutInterval: Math.max(
                          0,
                          (step.calloutInterval ?? defaultCalloutInterval(step.duration ?? 0)) - is.duration.step
                        ),
                      } as CustomTextStep)
                    }
                  >
                    <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.value, disabled && styles.valueDisabled]}>
                    {effectiveCalloutInterval({ duration: step.duration ?? 0, calloutInterval: step.calloutInterval }) === 0
                      ? 'No'
                      : effectiveCalloutInterval({ duration: step.duration ?? 0, calloutInterval: step.calloutInterval })}
                  </Text>
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={() =>
                      onUpdate({
                        ...step,
                        calloutInterval: Math.min(
                          step.duration ?? 0,
                          (step.calloutInterval ?? defaultCalloutInterval(step.duration ?? 0)) + is.duration.step
                        ),
                      } as CustomTextStep)
                    }
                  >
                    <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Countdown</Text>
                <View style={styles.durationControls}>
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={() => {
                      const dur = step.duration ?? 0
                      const next = Math.max(0, Math.min(step.countdownFrom ?? 10, dur) - 1)
                      onUpdate({ ...step, countdownFrom: next } as CustomTextStep)
                    }}
                  >
                    <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.value, disabled && styles.valueDisabled]}>
                    {(() => {
                      const dur = step.duration ?? 0
                      const val = Math.min(step.countdownFrom ?? 10, dur)
                      return val === 0 ? 'No' : val
                    })()}
                  </Text>
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={() => {
                      const dur = step.duration ?? 0
                      const current = Math.min(step.countdownFrom ?? 10, dur)
                      onUpdate({ ...step, countdownFrom: Math.min(dur, current + 1) } as CustomTextStep)
                    }}
                  >
                    <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
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
    minWidth: 28,
    width: 28,
    fontSize: 14,
    fontWeight: '600',
    color: '#5B9A8B',
    textAlign: 'left',
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
  audioCueRow: {
    gap: 12,
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
