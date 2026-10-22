import { useMemo } from 'react'
import { useMarkets } from '@/hooks/useMarkets'
import { useWalletStore } from '@/store/walletStore'

/**
 * Your portfolio's value over the last 7 days, hour by hour, without any extra API calls.
 *
 * CoinGecko already sends each coin's 7-day price history (`sparkline_in_7d`, 168 hourly points)
 * with the market data. For every hour: value = Σ (amount you hold × that coin's price then).
 * (It assumes you held the same amounts all week, which is fine for a demo portfolio chart.)
 */
export function usePortfolioHistory() {
  const holdings = useWalletStore((s) => s.holdings)
  const markets = useMarkets()

  return useMemo(() => {
    const coins = markets.data?.coins ?? []
    const series = holdings
      .map((h) => ({
        amount: h.amount,
        prices: coins.find((c) => c.id === h.coinId)?.sparkline_in_7d?.price,
      }))
      .filter((s): s is { amount: number; prices: number[] } => !!s.prices?.length)

    if (series.length === 0) return { values: [], change: 0, changePercent: 0 }

    // Coins can have slightly different point counts; use the shortest so every hour lines up
    const length = Math.min(...series.map((s) => s.prices.length))
    const values = Array.from({ length }, (_, i) =>
      series.reduce((sum, s) => sum + s.amount * s.prices[s.prices.length - length + i], 0),
    )
    const first = values[0]
    const last = values[values.length - 1]
    return {
      values,
      change: last - first,
      changePercent: first ? ((last - first) / first) * 100 : 0,
    }
  }, [holdings, markets.data])
}
