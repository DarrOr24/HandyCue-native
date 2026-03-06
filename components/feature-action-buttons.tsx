import { ActionButton } from './action-button'
import type { IconName } from './icon-button'

export interface FeatureActionButtonsProps {
  /** Icon for primary button: 'play' | 'pause' */
  primaryIcon: IconName
  onPrimaryPress: () => void
  primaryDisabled?: boolean
  onReset: () => void
  resetDisabled?: boolean
}

/**
 * Shared action buttons for coach features: primary (play/pause) + reset.
 * Parent controls which icon and handler based on feature state.
 */
export function FeatureActionButtons({
  primaryIcon,
  onPrimaryPress,
  primaryDisabled = false,
  onReset,
  resetDisabled = false,
}: FeatureActionButtonsProps) {
  return (
    <>
      <ActionButton
        icon={primaryIcon}
        onPress={onPrimaryPress}
        disabled={primaryDisabled}
        variant="primary"
      />
      <ActionButton
        icon="refresh"
        onPress={onReset}
        disabled={resetDisabled}
        variant="danger"
      />
    </>
  )
}
