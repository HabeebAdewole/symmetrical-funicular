// The whole mock wallet lives here: one Zustand store, saved to localStorage
// so your demo wallet survives page refreshes.
//
// Reading:   const balance = useWalletStore((s) => s.holdings)
// Updating:  useWalletStore.getState().lock()   or   const lock = useWalletStore((s) => s.lock)

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { FiatCurrency } from '@/lib/format'
import { hashPin } from '@/lib/mockCrypto'
import {
  createStarterTransactions,
  STARTER_HOLDINGS,
  type Holding,
  type Transaction,
} from '@/mocks/wallet'

/**
 * none     → brand-new visitor, show Welcome
 * needsPin → has a seed phrase but hasn't set a PIN yet
 * ready    → fully set up (check `isLocked` to know whether to show the unlock screen)
 */
export type OnboardingStatus = 'none' | 'needsPin' | 'ready'

type WalletState = {
  status: OnboardingStatus
  seedPhrase: string[] | null
  pinHash: string | null
  /** Not persisted, so every fresh visit starts locked */
  isLocked: boolean
  holdings: Holding[]
  transactions: Transaction[]
  currency: FiatCurrency
  hideBalances: boolean
}

type WalletActions = {
  /** Called after the user confirms their new seed phrase */
  createWallet: (seedPhrase: string[]) => void
  importWallet: (seedPhrase: string[]) => void
  setPin: (pin: string) => Promise<void>
  /** Returns true if the PIN matched */
  unlock: (pin: string) => Promise<boolean>
  lock: () => void
  addTransaction: (tx: Transaction) => void
  setCurrency: (currency: FiatCurrency) => void
  toggleHideBalances: () => void
  /** Wipes everything, back to Welcome */
  reset: () => void
}

const initialState: WalletState = {
  status: 'none',
  seedPhrase: null,
  pinHash: null,
  isLocked: true,
  holdings: [],
  transactions: [],
  currency: 'usd',
  hideBalances: false,
}

/** Applies a transaction to balances (send = minus amount + fee, receive = plus, swap = both sides) */
function applyToHoldings(holdings: Holding[], tx: Transaction): Holding[] {
  const deltas: Record<string, number> = {}
  if (tx.type === 'send') deltas[tx.coinId] = -(tx.amount + tx.fee)
  if (tx.type === 'receive') deltas[tx.coinId] = tx.amount
  if (tx.type === 'swap' && tx.toCoinId && tx.toAmount) {
    deltas[tx.coinId] = -tx.amount
    deltas[tx.toCoinId] = tx.toAmount
  }

  const next = holdings.map((h) =>
    h.coinId in deltas ? { ...h, amount: Math.max(0, h.amount + deltas[h.coinId]) } : h,
  )
  for (const [coinId, delta] of Object.entries(deltas)) {
    if (!next.some((h) => h.coinId === coinId) && delta > 0) next.push({ coinId, amount: delta })
  }
  return next
}

export const useWalletStore = create<WalletState & WalletActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      createWallet: (seedPhrase) =>
        set({
          status: 'needsPin',
          seedPhrase,
          holdings: STARTER_HOLDINGS,
          transactions: createStarterTransactions(seedPhrase),
        }),

      // Importing behaves the same in the demo: the phrase deterministically seeds the history
      importWallet: (seedPhrase) => get().createWallet(seedPhrase),

      setPin: async (pin) => {
        const pinHash = await hashPin(pin)
        set({ pinHash, status: 'ready', isLocked: false })
      },

      unlock: async (pin) => {
        const matches = (await hashPin(pin)) === get().pinHash
        if (matches) set({ isLocked: false })
        return matches
      },

      lock: () => set({ isLocked: true }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
          // Failed transactions don't move money
          holdings: tx.status === 'failed' ? state.holdings : applyToHoldings(state.holdings, tx),
        })),

      setCurrency: (currency) => set({ currency }),

      toggleHideBalances: () => set((state) => ({ hideBalances: !state.hideBalances })),

      reset: () => set(initialState),
    }),
    {
      name: 'kova-wallet', // the localStorage key
      storage: createJSONStorage(() => localStorage),
      // Save everything except the lock flag
      partialize: ({ isLocked, ...rest }) => rest,
      version: 1,
    },
  ),
)
