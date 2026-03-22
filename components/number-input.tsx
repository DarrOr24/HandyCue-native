import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { inputContainerStyle, getInputHeightStyle } from '../theme/input-styles'

interface NumberInputProps {
  label: string
  value: number
  onDecrease: () => void
  onIncrease: () => void
  disabled?: boolean
}

export function NumberInput({
  label,
  value,
  onDecrease,
  onIncrease,
  disabled = false,
}: NumberInputProps) {
  return (
    <View style={[styles.row, getInputHeightStyle()]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]} numberOfLines={2}>
        {label}
      </Text>
      <View style={styles.controls}>
        <TouchableOpacity disabled={disabled} onPress={onDecrease}>
          <Text style={[styles.btn, disabled && styles.btnDisabled]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.value, disabled && styles.valueDisabled]}>{value}</Text>
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
    padding: 12,
    justifyContent: 'space-between',
    ...inputContainerStyle,
  },
  label: { fontSize: 15, lineHeight: 20, color: '#666', marginBottom: 4, flexShrink: 1 },
  labelDisabled: { color: '#999' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { flex: 1, fontSize: 20, fontWeight: '600', minWidth: 36, textAlign: 'center', color: '#374151' },
  valueDisabled: { color: '#999' },
  btn: { fontSize: 26, fontWeight: '600', color: '#5B9A8B', paddingHorizontal: 12 },
  btnDisabled: { color: '#999' },
})
