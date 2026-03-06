import { useState, useMemo } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Favorite } from '../../services/holdOn.favorites.service'
import { deleteFavorite } from '../../services/holdOn.favorites.service'

interface FavoritesModalProps {
  visible: boolean
  favorites: Favorite[]
  userId: string
  featureKey: string
  onSelect: (name: string) => void
  onClose: () => void
  onFavoritesChanged?: () => void
}

/**
 * Modal to browse and select a favorite. Shows search, list, and delete.
 */
export function FavoritesModal({
  visible,
  favorites,
  userId,
  featureKey,
  onSelect,
  onClose,
  onFavoritesChanged,
}: FavoritesModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState<string | null>(null)

  const filteredFavorites = useMemo(() => {
    if (!searchTerm.trim()) return favorites
    const term = searchTerm.toLowerCase()
    return favorites.filter((fav) => fav.name.toLowerCase().includes(term))
  }, [searchTerm, favorites])

  async function handleDelete(name: string) {
    Alert.alert(
      'Delete favorite?',
      `Remove "${name}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingName(name)
            try {
              await deleteFavorite(userId, featureKey, name)
              onFavoritesChanged?.()
              if (selectedName === name) setSelectedName(null)
            } catch (err) {
              Alert.alert('Error', 'Could not delete favorite.')
            } finally {
              setDeletingName(null)
            }
          },
        },
      ]
    )
  }

  function handleOpen() {
    if (selectedName) {
      onSelect(selectedName)
      onClose()
    }
  }

  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Choose a Favorite</Text>

          <View style={styles.searchRow}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search favorites..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')} hitSlop={12}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredFavorites}
            keyExtractor={(item) => item.name}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {favorites.length === 0
                  ? 'No favorites yet. Save your current settings to get started.'
                  : 'No matches'}
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedName === item.name && styles.itemSelected,
                ]}
                onPress={() => setSelectedName(item.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.itemText} numberOfLines={1}>
                  {item.name}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(item.name)}
                  disabled={deletingName === item.name}
                  hitSlop={12}
                  style={styles.deleteBtn}
                >
                  {deletingName === item.name ? (
                    <ActivityIndicator size="small" color="#dc2626" />
                  ) : (
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.openBtn, !selectedName && styles.openBtnDisabled]}
              onPress={handleOpen}
              disabled={!selectedName}
              activeOpacity={0.7}
            >
              <Text style={styles.openText}>Open</Text>
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
    maxWidth: 360,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  list: {
    maxHeight: 200,
  },
  listContent: {
    paddingBottom: 8,
  },
  empty: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemSelected: {
    backgroundColor: '#e5e7eb',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  deleteBtn: {
    padding: 4,
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
  openBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  openBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  openText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})
