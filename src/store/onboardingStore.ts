// Temporary state for the "create wallet" flow. Deliberately NOT persisted:
// if the user closes the app halfway, the unconfirmed phrase is gone and nothing half-made is saved.

import { create } from 'zustand'
import { generateSeedPhrase } from '@/lib/mockCrypto'

type OnboardingState = {
  draftPhrase: string[] | null
  /** Makes a new phrase (only if there isn't one already, so going back doesn't change the words) */
  startDraft: () => void
  clearDraft: () => void
}

export const useOnboardingStore = create<OnboardingState>()((set, get) => ({
  draftPhrase: null,
  startDraft: () => {
    if (!get().draftPhrase) set({ draftPhrase: generateSeedPhrase() })
  },
  clearDraft: () => set({ draftPhrase: null }),
}))
