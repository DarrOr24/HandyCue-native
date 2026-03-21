import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { CueStep, CueStepType } from '../../services/cueCraft.types'
import { genId, cueCraftDefaults } from '../../services/cueCraft.settings.service'

interface AddStepModalProps {
  visible: boolean
  onAdd: (step: CueStep) => void
  onCancel: () => void
  defaultValues?: { defaultValues?: Record<string, number> }
  /** When true, hide Sets option (only one allowed per flow) */
  hasSetsStep?: boolean
}

const STEP_OPTIONS: { type: CueStepType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'getReady', label: 'Get ready', icon: 'timer-outline' },
  { type: 'reps', label: 'Reps (repeats the steps below)', icon: 'repeat-outline' },
  { type: 'sets', label: 'Sets (repeats the whole sequence)', icon: 'layers-outline' },
  { type: 'customText', label: 'Audio Cue', icon: 'chatbubble-outline' },
]

export function AddStepModal({ visible, onAdd, onCancel, defaultValues, hasSetsStep = false }: AddStepModalProps) {
  const { width, height } = useWindowDimensions()
  const isAndroidLandscape = Platform.OS === 'android' && width > height

  if (!visible) return null

  const dv = defaultValues?.defaultValues ?? cueCraftDefaults.defaultValues

  function createStep(type: CueStepType) {
    const id = genId()
    switch (type) {
      case 'getReady':
        return { id, type: 'getReady' as const, duration: dv.getReadyTime ?? 5 }
      case 'reps':
        return { id, type: 'reps' as const, count: dv.repsCount ?? 5, announceReps: false }
      case 'sets':
        return {
          id,
          type: 'sets' as const,
          count: dv.setsCount ?? 1,
          restBetween: dv.setsRestBetween ?? 20,
          announceRestCountdown: true,
        }
      case 'customText':
        return { id, type: 'customText' as const, text: '', duration: 0 }
      default:
        return { id, type: 'customText' as const, text: '', duration: 0 }
    }
  }

  const modalContent = (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Add step</Text>
        <TouchableOpacity onPress={onCancel} hitSlop={12} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      {STEP_OPTIONS.filter((opt) => opt.type !== 'sets' || !hasSetsStep).map((opt) => (
        <TouchableOpacity
          key={opt.type}
          style={styles.option}
          onPress={() => {
            onAdd(createStep(opt.type))
            onCancel()
          }}
        >
          <Ionicons name={opt.icon} size={24} color="#5B9A8B" />
          <Text style={styles.optionLabel}>{opt.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}
    </>
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.backdropInner} pointerEvents="box-none">
          <View
            style={[styles.modal, isAndroidLandscape && { maxHeight: height * 0.7 }]}
            onStartShouldSetResponder={() => true}
          >
          {isAndroidLandscape ? (
            <ScrollView
              showsVerticalScrollIndicator={true}
              bounces={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {modalContent}
            </ScrollView>
          ) : (
            modalContent
          )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalScrollContent: {
    paddingBottom: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  closeBtn: {
    padding: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
})
