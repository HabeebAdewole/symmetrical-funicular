// App preferences that should survive a wallet reset (kept separate from walletStore on purpose).

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'system' | 'light' | 'dark'

type PreferencesState = {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'kova-preferences' },
  ),
)
