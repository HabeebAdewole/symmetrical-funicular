import { useQuery } from '@tanstack/react-query'
import { fetchMarkets, type MarketCoin } from '@/lib/coingecko'
import { getMockMarkets } from '@/mocks/markets'
import { useWalletStore } from '@/store/walletStore'

type MarketsResult = {
  coins: MarketCoin[]
  /** true when CoinGecko failed and we're showing bundled sample data */
  isFallback: boolean
}

/** Live prices for every supported coin, in the user's chosen currency. */
export function useMarkets() {
  const currency = useWalletStore((state) => state.currency)

  return useQuery({
    // The key identifies this data in the cache. Changing currency = a different cache entry.
    queryKey: ['markets', currency],
    queryFn: async (): Promise<MarketsResult> => {
      try {
        return { coins: await fetchMarkets(currency), isFallback: false }
      } catch {
        // Rate-limited or offline: keep the demo working with sample data
        return { coins: getMockMarkets(currency), isFallback: true }
      }
    },
    // Refresh prices every 60 seconds while the app is open
    refetchInterval: 60_000,
  })
}

/** Convenience: a single coin out of the markets list (shares the same cache, no extra request). */
export function useMarketCoin(id: string) {
  const query = useMarkets()
  return { ...query, coin: query.data?.coins.find((coin) => coin.id === id) }
}
