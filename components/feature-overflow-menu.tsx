import { Alert } from 'react-native'
import { OverflowMenu } from './overflow-menu'
import type { OverflowMenuItem } from './overflow-menu'

export interface FeatureOverflowMenuHandlers {
  onInfo: () => void | Promise<void>
  onSetVoice: () => void | Promise<void>
  onFavorites: () => void
  onSave: () => void
  onSettings: () => void | Promise<void>
  onDemos?: () => void | Promise<void>
  onDrillIdeas?: () => void | Promise<void>
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
    ...(handlersRef.current.onDemos
      ? [
          {
            icon: 'videocam-outline' as const,
            label: 'Demos',
            onPress: () => void handlersRef.current.onDemos?.(),
          },
        ]
      : []),
    ...(handlersRef.current.onDrillIdeas
      ? [
          {
            icon: 'bulb-outline' as const,
            label: 'Drill ideas',
            onPress: () => void handlersRef.current.onDrillIdeas?.(),
          },
        ]
      : []),
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
      onPress: () => void handlersRef.current.onSettings(),
    },
  ]

  return <OverflowMenu items={items} />
}
