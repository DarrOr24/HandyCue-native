import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { inputContainerStyle } from '../theme/input-styles'

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
  const { width, height } = useWindowDimensions()
  const isLandscape = Platform.OS === 'android' && width > height

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

  const addBlock = (
    <View style={[styles.addSection, !isLandscape && styles.addSectionPortrait]}>
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
  )

  const removeBlock = allCustomShapes.length > 0 ? (
    <View style={[styles.removeSection, !isLandscape && styles.removeSectionPortrait]}>
      <Text style={[styles.pickerLabel, styles.pickerLabelAbove]}>Remove shape:</Text>
      <View style={styles.removeChipRow}>
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
        <TouchableOpacity
          style={[styles.removeBtn, !shapeToRemove && styles.removeBtnDisabled]}
          onPress={handleRemoveShape}
          disabled={!shapeToRemove}
        >
          <Ionicons
            name="close-circle-outline"
            size={28}
            color={shapeToRemove ? '#dc2626' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>
    </View>
  ) : null

  return (
    <View style={styles.group}>
      {isLandscape ? (
        <>
          <Text style={styles.groupTitle}>Shapes</Text>
          <View style={styles.shapesRow}>
            {addBlock}
            {allCustomShapes.length > 0 ? (
              <View style={styles.removeSection}>
                <View style={styles.removeChipRow}>
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
                  <TouchableOpacity
                    style={[styles.removeBtn, !shapeToRemove && styles.removeBtnDisabled]}
                    onPress={handleRemoveShape}
                    disabled={!shapeToRemove}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={28}
                      color={shapeToRemove ? '#dc2626' : '#9ca3af'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.groupTitle}>Shapes</Text>
          {addBlock}
          {removeBlock}
        </>
      )}
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
  shapesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  addSectionPortrait: {
    flex: 0,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f5f7f6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    ...(Platform.OS === 'web' ? {} : {}),
  },
  addBtn: {
    padding: 4,
  },
  removeSection: {
    flex: 1,
    minWidth: 0,
  },
  removeSectionPortrait: {
    flex: 0,
  },
  removeChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  pickerLabelAbove: {
    marginBottom: 8,
  },
  pickerRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minWidth: 0,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...inputContainerStyle,
    borderRadius: 8,
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
