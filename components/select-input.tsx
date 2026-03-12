import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { inputContainerStyle } from '../theme/input-styles'

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const idx = options.findIndex((o) => o.value === value)
  const currentIdx = idx >= 0 ? idx : 0
  const displayLabel = options[currentIdx]?.label ?? value

  function handleSelect(opt: SelectOption) {
    onChange(opt.value)
    setDropdownOpen(false)
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
      <TouchableOpacity
        style={[styles.dropdownTrigger, disabled && styles.dropdownTriggerDisabled]}
        onPress={() => !disabled && setDropdownOpen(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.value, disabled && styles.valueDisabled]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
        >
          {displayLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? '#999' : '#5B9A8B'}
        />
      </TouchableOpacity>

      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setDropdownOpen(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose {label}</Text>
            <ScrollView
              style={styles.optionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.optionRow,
                    opt.value === value && styles.optionRowSelected,
                  ]}
                  onPress={() => handleSelect(opt)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      opt.value === value && styles.optionLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {opt.value === value && (
                    <Ionicons name="checkmark" size={22} color="#5B9A8B" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setDropdownOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 72,
    padding: 12,
    ...inputContainerStyle,
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
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  dropdownTriggerDisabled: { backgroundColor: '#f3f4f6', opacity: 0.7 },
  value: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  valueDisabled: { color: '#999' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  } as const,
  modalContent: {
    width: '100%',
    maxWidth: 320,
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionsList: {
    maxHeight: 280,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionRowSelected: {
    backgroundColor: '#ecfdf5',
  },
  optionLabel: { fontSize: 16, color: '#374151' },
  optionLabelSelected: { fontWeight: '600', color: '#5B9A8B' },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 16, color: '#6b7280' },
})
