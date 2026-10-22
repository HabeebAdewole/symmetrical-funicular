import { useMemo } from 'react'
import type { MarketCoin } from '@/lib/coingecko'
import { useMarkets } from '@/hooks/useMarkets'
import { useWalletStore } from '@/store/walletStore'

export type PortfolioAsset = {
  coin: MarketCoin
  amount: number
  /** amount × current price, in the user's currency */
  value: number
  /** share of the total portfolio, 0–100 */
  allocation: number
}

/**
 * Joins mock balances (store) with live prices (CoinGecko) into what the Home screen shows:
 * total balance, 24h change, and per-asset values sorted biggest first.
 */
export function usePortfolio() {
  const holdings = useWalletStore((state) => state.holdings)
  const markets = useMarkets()

  const portfolio = useMemo(() => {
    const coins = markets.data?.coins ?? []
    const withPrices = holdings.flatMap((holding) => {
      const coin = coins.find((c) => c.id === holding.coinId)
      return coin
        ? [{ coin, amount: holding.amount, value: holding.amount * coin.current_price }]
        : []
    })

    const totalValue = withPrices.reduce((sum, asset) => sum + asset.value, 0)
    // What the portfolio was worth 24h ago, using each coin's 24h % change
    const valueYesterday = withPrices.reduce(
      (sum, a) => sum + a.value / (1 + a.coin.price_change_percentage_24h / 100),
      0,
    )
    const change24h = totalValue - valueYesterday

    const assets: PortfolioAsset[] = withPrices
      .map((a) => ({ ...a, allocation: totalValue ? (a.value / totalValue) * 100 : 0 }))
      .sort((a, b) => b.value - a.value)

    return {
      assets,
      totalValue,
      change24h,
      change24hPercent: valueYesterday ? (change24h / valueYesterday) * 100 : 0,
    }
  }, [holdings, markets.data])

  return {
    ...portfolio,
    isLoading: markets.isLoading,
    isFallback: markets.data?.isFallback ?? false,
  }
}
