import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native'

interface ConfirmReplaceModalProps {
  visible: boolean
  name: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmation dialog when saving a favorite with a name that already exists.
 */
export function ConfirmReplaceModal({
  visible,
  name,
  onConfirm,
  onCancel,
}: ConfirmReplaceModalProps) {
  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Replace Favorite?</Text>
          <Text style={styles.message}>
            A favorite named <Text style={styles.bold}>{name}</Text> already exists. Do you want to
            replace it?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.replaceBtn}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.replaceText}>Replace</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  bold: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
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
  replaceBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dc2626',
    borderRadius: 8,
  },
  replaceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})
