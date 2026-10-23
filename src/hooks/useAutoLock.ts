import { useEffect } from 'react'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useWalletStore } from '@/store/walletStore'

/**
 * Locks the wallet when you come back to Kova after being away longer than the chosen time
 * (Settings → Auto-lock). "Away" = the app was in the background or the tab was hidden.
 */
export function useAutoLock() {
  const autoLock = usePreferencesStore((s) => s.autoLock)

  useEffect(() => {
    if (autoLock < 0) return // "Never"
    let hiddenAt: number | null = null

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now()
        // "Immediately": lock as we leave, so the app switcher never shows the unlocked wallet
        if (autoLock === 0) lockIfReady()
      } else if (hiddenAt !== null) {
        if (Date.now() - hiddenAt >= autoLock) lockIfReady()
        hiddenAt = null
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [autoLock])
}

/** Only a fully set-up wallet can be locked (not someone halfway through onboarding) */
function lockIfReady() {
  const { status, lock } = useWalletStore.getState()
  if (status === 'ready') lock()
}
