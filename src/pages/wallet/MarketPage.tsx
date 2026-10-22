import { PlaceholderPage } from '@/components/PlaceholderPage'
import { useMarkets } from '@/hooks/useMarkets'
import { formatFiat, formatPercent } from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

export default function MarketPage() {
  const { data, isLoading } = useMarkets()
  const currency = useWalletStore((state) => state.currency)

  return (
    <>
      {/* Temporary data-layer check; Phase 3 replaces this whole page with the real design */}
      <section className="flex flex-col gap-3 p-6 pb-0">
        <p className="text-text-muted text-sm">
          {isLoading
            ? 'Loading prices…'
            : data?.isFallback
              ? 'Sample data (offline)'
              : 'Live from CoinGecko'}
        </p>
        <ul className="flex flex-col gap-2">
          {data?.coins.map((coin) => (
            <li key={coin.id} className="flex items-center gap-3">
              <img src={coin.image} alt="" className="size-6 rounded-full" />
              <span className="flex-1">{coin.name}</span>
              <span className="tabular-nums">{formatFiat(coin.current_price, currency)}</span>
              <span
                className={`w-16 text-right text-sm tabular-nums ${
                  coin.price_change_percentage_24h >= 0 ? 'text-positive' : 'text-negative'
                }`}
              >
                {formatPercent(coin.price_change_percentage_24h)}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <PlaceholderPage title="Market & explore" phase={3} />
    </>
  )
}
