import { Alert } from 'react-native'
import { OverflowMenu } from './overflow-menu'
import type { OverflowMenuItem } from './overflow-menu'

export interface FeatureOverflowMenuHandlers {
  onInfo: () => void
  onSetVoice: () => void
  onFavorites: () => void
  onSave: () => void
  onSettings: () => void
  session: { user?: { id?: string } } | null
}

interface FeatureOverflowMenuProps {
  handlersRef: React.MutableRefObject<FeatureOverflowMenuHandlers>
}

/**
 * Shared overflow menu for coach features (HoldOn, EntryBuddy, etc.).
 * Info, Set voice, Favorites, Save, Settings.
 * Favorites and Save require login; shows alert when not logged in.
 */
export function FeatureOverflowMenu({ handlersRef }: FeatureOverflowMenuProps) {
  const items: OverflowMenuItem[] = [
    {
      icon: 'information-circle-outline',
      label: 'Info',
      onPress: () => handlersRef.current.onInfo(),
    },
    {
      icon: 'mic-outline',
      label: 'Set voice',
      onPress: () => handlersRef.current.onSetVoice(),
    },
    {
      icon: 'heart-outline',
      label: 'Favorites',
      onPress: () => {
        const { session, onFavorites } = handlersRef.current
        if (!session?.user?.id) {
          Alert.alert('Log in required', 'Please log in to view your favorites.')
          return
        }
        requestAnimationFrame(() => onFavorites())
      },
    },
    {
      icon: 'bookmark-outline',
      label: 'Save',
      onPress: () => {
        const { session, onSave } = handlersRef.current
        if (!session?.user?.id) {
          Alert.alert('Log in required', 'Please log in to save favorites.')
          return
        }
        requestAnimationFrame(() => onSave())
      },
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      onPress: () => handlersRef.current.onSettings(),
    },
  ]

  return <OverflowMenu items={items} />
}
