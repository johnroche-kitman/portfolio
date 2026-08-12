// Shared fixed-position geometry for the bottom-right support widget and the
// Ask My iP toast, so the toast always sits a fixed gap above the widget
// regardless of which one changes size later.
export const SUPPORT_FAB_SIZE = 60
export const SUPPORT_FAB_OFFSET = 24
export const TOAST_GAP_ABOVE_FAB = 10

export const TOAST_BOTTOM_OFFSET = SUPPORT_FAB_OFFSET + SUPPORT_FAB_SIZE + TOAST_GAP_ABOVE_FAB
