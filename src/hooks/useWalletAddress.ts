import { useMemo } from 'react'
import { deriveMockAddress, networkForCoin } from '@/lib/mockCrypto'
import { useWalletStore } from '@/store/walletStore'

/** This wallet's (fake but stable) receiving address for a coin's network. */
export function useWalletAddress(coinId: string) {
  const seedPhrase = useWalletStore((s) => s.seedPhrase)
  return useMemo(
    () => (seedPhrase ? deriveMockAddress(seedPhrase, networkForCoin(coinId)) : ''),
    [seedPhrase, coinId],
  )
}
