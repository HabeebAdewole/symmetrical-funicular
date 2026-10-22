// App preferences that should survive a wallet reset (kept separate from walletStore on purpose).

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'system' | 'light' | 'dark'

type PreferencesState = {
  theme: ThemePreference
  /** Shown in the Home greeting. Empty = no name ("Welcome back"). Editable in Settings. */
  displayName: string
  setTheme: (theme: ThemePreference) => void
  setDisplayName: (name: string) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      displayName: '',
      setTheme: (theme) => set({ theme }),
      setDisplayName: (displayName) => set({ displayName: displayName.trim().slice(0, 24) }),
    }),
    { name: 'kova-preferences' },
  ),
)
