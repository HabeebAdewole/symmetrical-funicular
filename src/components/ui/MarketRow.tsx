import { Link } from 'react-router'
import { CoinLogo } from '@/components/ui/CoinLogo'
import { Sparkline } from '@/components/ui/Sparkline'
import type { MarketCoin } from '@/lib/coingecko'
import { cx } from '@/lib/cx'
import { formatCompactFiat, formatFiat, formatPercent, type FiatCurrency } from '@/lib/format'

/** Market list row (Figma: Market Row): logo, name + market cap, 7-day sparkline, price + 24h change. */
export function MarketRow({ coin, currency }: { coin: MarketCoin; currency: FiatCurrency }) {
  const change = coin.price_change_percentage_24h ?? 0
  const up = change >= 0

  return (
    <Link
      to={`/asset/${coin.id}`}
      className="active:bg-surface-raised -mx-2 flex items-center gap-2.5 rounded-md px-2 py-2.5 transition-colors"
    >
      <CoinLogo image={coin.image} symbol={coin.symbol} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-semibold">{coin.name}</span>
        <span className="text-caption text-text-muted numeric truncate">
          {coin.symbol.toUpperCase()} · {formatCompactFiat(coin.market_cap, currency)}
        </span>
      </span>
      {coin.sparkline_in_7d && (
        <Sparkline values={coin.sparkline_in_7d.price} positive={up} width={48} />
      )}
      <span className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="numeric font-semibold">{formatFiat(coin.current_price, currency)}</span>
        <span className={cx('numeric text-caption', up ? 'text-positive' : 'text-negative')}>
          {formatPercent(change)}
        </span>
      </span>
    </Link>
  )
}
