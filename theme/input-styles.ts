/**
 * Shared input styling for features and settings.
 * Single source of truth — change here to update all inputs app-wide.
 */
export const INPUT_BACKGROUND = '#f5f7f6'
export const INPUT_BORDER_COLOR = '#e5e7eb'
export const INPUT_BORDER_WIDTH = 1
export const INPUT_BORDER_RADIUS = 10

/** Fixed height for all feature inputs so NumberInput, SelectInput, etc. stay aligned. */
export const INPUT_HEIGHT = 88

export const inputContainerStyle = {
  backgroundColor: INPUT_BACKGROUND,
  borderWidth: INPUT_BORDER_WIDTH,
  borderColor: INPUT_BORDER_COLOR,
  borderRadius: INPUT_BORDER_RADIUS,
} as const
