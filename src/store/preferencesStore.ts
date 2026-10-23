// App preferences that should survive a wallet reset (kept separate from walletStore on purpose).

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'system' | 'light' | 'dark'

/** How long Kova can be in the background before it asks for the PIN again (ms). -1 = never. */
export type AutoLock = 0 | 60_000 | 300_000 | -1

type PreferencesState = {
  theme: ThemePreference
  /** Shown in the Home greeting. Empty = no name ("Welcome back"). */
  displayName: string
  autoLock: AutoLock
  /** Demo only: stored, but unlocking still uses the PIN (see Settings) */
  biometrics: boolean
  /** Price-move notifications on/off */
  priceAlerts: boolean
  setTheme: (theme: ThemePreference) => void
  setDisplayName: (name: string) => void
  setAutoLock: (autoLock: AutoLock) => void
  setBiometrics: (on: boolean) => void
  setPriceAlerts: (on: boolean) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      displayName: '',
      autoLock: 60_000,
      biometrics: false,
      priceAlerts: true,
      setTheme: (theme) => set({ theme }),
      setDisplayName: (displayName) => set({ displayName: displayName.trim().slice(0, 24) }),
      setAutoLock: (autoLock) => set({ autoLock }),
      setBiometrics: (biometrics) => set({ biometrics }),
      setPriceAlerts: (priceAlerts) => set({ priceAlerts }),
    }),
    { name: 'kova-preferences' },
  ),
)
