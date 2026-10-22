import { useMemo } from 'react'
import { useMarkets } from '@/hooks/useMarkets'

/**
 * Small lookups many screens need from market data:
 * - symbols: { bitcoin: 'BTC', … } for labelling transactions
 * - names:   { bitcoin: 'Bitcoin', … }
 * - usdRate: how much 1 USD is in the user's currency. Mock transactions store USD values, and USDC's price
 *   in the user's currency is (almost exactly) that rate.
 */
export function useMarketLookup() {
  const markets = useMarkets()

  return useMemo(() => {
    const coins = markets.data?.coins ?? []
    return {
      symbols: Object.fromEntries(coins.map((c) => [c.id, c.symbol.toUpperCase()])) as Record<
        string,
        string
      >,
      names: Object.fromEntries(coins.map((c) => [c.id, c.name])) as Record<string, string>,
      usdRate: coins.find((c) => c.id === 'usd-coin')?.current_price ?? 1,
      coins,
    }
  }, [markets.data])
}
