// Tiny vibrations that make taps feel physical, like a native app.
// Works on Android Chrome. iOS Safari has no vibration API, so these quietly do nothing there.

const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern)
}

export const haptics = {
  /** Keypad press, toggles */
  tap: () => vibrate(8),
  /** Something completed (PIN set, transaction sent) */
  success: () => vibrate([10, 40, 10]),
  /** Wrong PIN, invalid input */
  error: () => vibrate([30, 40, 30]),
}
