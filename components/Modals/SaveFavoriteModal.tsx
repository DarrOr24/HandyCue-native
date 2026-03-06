import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

interface SaveFavoriteModalProps {
  visible: boolean
  onSave: (name: string) => void
  onCancel: () => void
}

/**
 * Modal to save current inputs as a favorite.
 */
export function SaveFavoriteModal({
  visible,
  onSave,
  onCancel,
}: SaveFavoriteModalProps) {
  const [favoriteName, setFavoriteName] = useState('')

  useEffect(() => {
    if (visible) {
      setFavoriteName('')
    }
  }, [visible])

  function handleSave() {
    const trimmed = favoriteName.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrapper}
        >
          <View style={styles.modal} onStartShouldSetResponder={() => true}>
            <Text style={styles.title}>Save Favorite</Text>

            <View style={styles.section}>
              <Text style={styles.label}>Favorite name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Chest to wall handstand..."
                placeholderTextColor="#9ca3af"
                value={favoriteName}
                onChangeText={setFavoriteName}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !favoriteName.trim() && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!favoriteName.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  keyboardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  section: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  saveBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})
