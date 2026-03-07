import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

export interface SelectOption {
  value: string
  label: string
}

interface SelectInputProps {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  onRemove?: () => void
}

export function SelectInput({
  label,
  options,
  value,
  onChange,
  disabled = false,
  onRemove,
}: SelectInputProps) {
  const idx = options.findIndex((o) => o.value === value)
  const currentIdx = idx >= 0 ? idx : 0
  const displayLabel = options[currentIdx]?.label ?? value

  function onDecrease() {
    const nextIdx = currentIdx <= 0 ? options.length - 1 : currentIdx - 1
    onChange(options[nextIdx].value)
  }

  function onIncrease() {
    const nextIdx = currentIdx >= options.length - 1 ? 0 : currentIdx + 1
    onChange(options[nextIdx].value)
  }

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, disabled && styles.labelDisabled]} numberOfLines={2}>
          {label}
        </Text>
        {onRemove && (
          <TouchableOpacity
            onPress={onRemove}
            disabled={disabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.removeBtn, disabled && styles.removeBtnDisabled]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity disabled={disabled} onPress={onDecrease}>
          <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.value, disabled && styles.valueDisabled]} numberOfLines={1} adjustsFontSizeToFit>
          {displayLabel}
        </Text>
        <TouchableOpacity disabled={disabled} onPress={onIncrease}>
          <Text style={[styles.btn, disabled && styles.btnDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 72,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: { fontSize: 15, color: '#666', flexShrink: 1 },
  labelDisabled: { color: '#999' },
  removeBtn: { fontSize: 14, color: '#dc2626', fontWeight: '600', paddingLeft: 8 },
  removeBtnDisabled: { color: '#999' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { flex: 1, fontSize: 14, fontWeight: '600', minWidth: 36, textAlign: 'center', color: '#374151' },
  valueDisabled: { color: '#999' },
  btn: { fontSize: 26, fontWeight: '600', color: '#5B9A8B', paddingHorizontal: 12 },
  btnDisabled: { color: '#999' },
})
