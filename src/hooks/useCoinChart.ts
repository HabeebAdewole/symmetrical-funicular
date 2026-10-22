import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchCoinChart, type ChartRange, type PricePoint } from '@/lib/coingecko'
import { getMockChart } from '@/mocks/markets'
import { useWalletStore } from '@/store/walletStore'

type ChartResult = {
  prices: PricePoint[]
  isFallback: boolean
}

/** Price history for one coin. `days` = '1' | '7' | '30' | '365'. */
export function useCoinChart(id: string, days: ChartRange) {
  const currency = useWalletStore((state) => state.currency)

  return useQuery({
    queryKey: ['chart', id, currency, days],
    queryFn: async (): Promise<ChartResult> => {
      try {
        return { prices: await fetchCoinChart(id, currency, days), isFallback: false }
      } catch {
        return { prices: getMockChart(id, currency, days), isFallback: true }
      }
    },
    // Chart history changes slowly, so cache it for 5 minutes
    staleTime: 5 * 60_000,
    // While switching 7D → 30D, keep showing the old chart instead of flashing empty
    placeholderData: keepPreviousData,
  })
}
