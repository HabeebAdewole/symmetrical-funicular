import { useQuery } from '@tanstack/react-query'
import { fetchGlobal, type GlobalMarket } from '@/lib/coingecko'
import { getMockGlobal } from '@/mocks/markets'
import { useWalletStore } from '@/store/walletStore'

/** Total crypto market cap + 24h volume, with the same offline fallback as useMarkets */
export function useGlobalMarket() {
  const currency = useWalletStore((state) => state.currency)

  return useQuery({
    queryKey: ['global', currency],
    queryFn: async (): Promise<GlobalMarket & { isFallback: boolean }> => {
      try {
        return { ...(await fetchGlobal(currency)), isFallback: false }
      } catch {
        return { ...getMockGlobal(currency), isFallback: true }
      }
    },
    staleTime: 5 * 60_000,
  })
}
