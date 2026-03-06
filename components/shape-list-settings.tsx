import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const DEFAULT_SHAPES = ['tuck', 'straight', 'straddle', 'pike', 'diamond']

interface ShapeListSettingsProps {
  customShapes: string[]
  setCustomShapes: (shapes: string[]) => void
}

/**
 * Add and remove custom shape names for ShapeJam.
 * Default shapes (tuck, straight, straddle, pike, diamond) cannot be removed.
 */
export function ShapeListSettings({ customShapes, setCustomShapes }: ShapeListSettingsProps) {
  const [newShape, setNewShape] = useState('')
  const [shapeToRemove, setShapeToRemove] = useState('')

  const allCustomShapes = customShapes.filter((s) => !DEFAULT_SHAPES.includes(s))

  function handleAddShape() {
    const trimmed = newShape.trim().toLowerCase()
    if (
      trimmed &&
      !DEFAULT_SHAPES.includes(trimmed) &&
      !customShapes.includes(trimmed)
    ) {
      setCustomShapes([...customShapes, trimmed])
      setNewShape('')
    }
  }

  function handleRemoveShape() {
    if (!shapeToRemove) return
    setCustomShapes(customShapes.filter((s) => s !== shapeToRemove))
    setShapeToRemove('')
  }

  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>Shapes</Text>

      {/* Add Shape */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter shape name"
          placeholderTextColor="#9ca3af"
          value={newShape}
          onChangeText={setNewShape}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleAddShape}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddShape}
          disabled={!newShape.trim()}
        >
          <Ionicons
            name="add-circle-outline"
            size={28}
            color={newShape.trim() ? '#5B9A8B' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>

      {/* Remove Shape */}
      {allCustomShapes.length > 0 && (
        <View style={styles.removeRow}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Remove shape:</Text>
            <View style={styles.pickerRow}>
              {allCustomShapes.map((shape) => (
                <TouchableOpacity
                  key={shape}
                  style={[
                    styles.chip,
                    shapeToRemove === shape && styles.chipSelected,
                  ]}
                  onPress={() => setShapeToRemove(shapeToRemove === shape ? '' : shape)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      shapeToRemove === shape && styles.chipTextSelected,
                    ]}
                  >
                    {shape}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.removeBtn, !shapeToRemove && styles.removeBtnDisabled]}
            onPress={handleRemoveShape}
            disabled={!shapeToRemove}
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={shapeToRemove ? '#dc2626' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>
      )}
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
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    ...(Platform.OS === 'web' ? {} : {}),
  },
  addBtn: {
    padding: 4,
  },
  removeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  chipSelected: {
    borderColor: '#5B9A8B',
    backgroundColor: '#e8f5f3',
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#5B9A8B',
    fontWeight: '600',
  },
  removeBtn: {
    padding: 4,
  },
  removeBtnDisabled: {
    opacity: 0.5,
  },
})
