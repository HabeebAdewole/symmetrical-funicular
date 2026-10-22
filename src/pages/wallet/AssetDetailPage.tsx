import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { CoinLogo } from '@/components/ui/CoinLogo'
import { PriceChart } from '@/components/ui/PriceChart'
import { QuickAction } from '@/components/ui/QuickAction'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton'
import { TopBar } from '@/components/ui/TopBar'
import { TransactionRow } from '@/components/ui/TransactionRow'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { useCoinChart } from '@/hooks/useCoinChart'
import { useMarketLookup } from '@/hooks/useMarketLookup'
import { useMarketCoin } from '@/hooks/useMarkets'
import type { ChartRange, PricePoint } from '@/lib/coingecko'
import { cx } from '@/lib/cx'
import {
  formatCompactFiat,
  formatCompactNumber,
  formatCrypto,
  formatFiat,
  formatPercent,
} from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

const ranges: { value: ChartRange; label: string; period: string }[] = [
  { value: '1', label: '1D', period: 'today' },
  { value: '7', label: '1W', period: 'past week' },
  { value: '30', label: '1M', period: 'past month' },
  { value: '365', label: '1Y', period: 'past year' },
]

export default function AssetDetailPage() {
  const { coinId = '' } = useParams()
  const navigate = useNavigate()
  const currency = useWalletStore((s) => s.currency)
  const holdings = useWalletStore((s) => s.holdings)
  const transactions = useWalletStore((s) => s.transactions)
  const { coin, isLoading } = useMarketCoin(coinId)
  const { symbols, usdRate } = useMarketLookup()
  const [range, setRange] = useState<ChartRange>('7')
  const chart = useCoinChart(coinId, range, !!coin)
  const [scrub, setScrub] = useState<PricePoint | null>(null)

  const points = useMemo(() => chart.data?.prices ?? [], [chart.data])
  // Change across the selected range: first vs last point of the chart
  const rangeChange = points.length > 1 ? (points.at(-1)![1] / points[0][1] - 1) * 100 : null
  const change = rangeChange ?? coin?.price_change_percentage_24h ?? 0
  const up = change >= 0

  const recent = transactions
    .filter((t) => t.coinId === coinId || t.toCoinId === coinId)
    .slice(0, 3)

  if (!isLoading && !coin) {
    return (
      <div className="flex flex-col items-center gap-4 px-5 pt-24 text-center">
        <h1 className="text-h1 font-bold">Coin not found</h1>
        <p className="text-text-muted">Kova doesn’t support “{coinId}” yet.</p>
        <Link to="/market" className={buttonStyles('secondary', false)}>
          Back to Market
        </Link>
      </div>
    )
  }

  const holding = holdings.find((h) => h.coinId === coinId)
  const price = scrub ? scrub[1] : (coin?.current_price ?? 0)
  const period = ranges.find((r) => r.value === range)!.period
  const symbol = coin?.symbol.toUpperCase() ?? ''

  return (
    <div className="flex flex-col">
      <TopBar title={coin?.name ?? ''} onBack={() => navigate(-1)} />
      <div className="flex flex-col gap-5 px-5 pb-4">
        {/* Price header: shows the scrubbed price while a finger is on the chart */}
        <section className="flex flex-col gap-1.5" aria-live="polite">
          {coin ? (
            <span className="text-small text-text-muted flex items-center gap-2 font-semibold">
              <CoinLogo image={coin.image} symbol={coin.symbol} size={28} />
              {coin.name} · {symbol}
            </span>
          ) : (
            <Skeleton className="h-7 w-32" />
          )}
          {coin ? (
            <p className="numeric text-display font-extrabold">{formatFiat(price, currency)}</p>
          ) : (
            <Skeleton className="h-10 w-48" />
          )}
          {scrub ? (
            <span className="text-small text-text-muted">
              {new Date(scrub[0]).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                ...(range === '1' && { hour: 'numeric', minute: '2-digit' }),
              })}
            </span>
          ) : (
            coin && (
              <span
                className={cx(
                  'bg-surface-raised text-small numeric w-fit rounded-full px-2.5 py-0.5 font-semibold',
                  up ? 'text-positive' : 'text-negative',
                )}
              >
                {formatPercent(change)} {period}
              </span>
            )
          )}
        </section>

        {chart.isPending ? (
          <Skeleton className="h-45 w-full rounded-lg" />
        ) : (
          <PriceChart points={points} positive={up} onScrub={setScrub} />
        )}

        <SegmentedControl label="Chart range" options={ranges} value={range} onChange={setRange} />

        <section className="bg-surface flex items-center justify-between gap-3 rounded-lg p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-caption text-text-muted">Your balance</span>
            <span className="numeric text-h2 font-bold">
              {formatFiat((holding?.amount ?? 0) * (coin?.current_price ?? 0), currency)}
            </span>
          </div>
          <span className="numeric text-small text-text-muted font-semibold">
            {formatCrypto(holding?.amount ?? 0, symbol)}
          </span>
        </section>

        <div className="flex justify-around">
          <QuickAction
            icon="send"
            label="Send"
            tone="filled"
            onClick={() => navigate(`/send?coin=${coinId}`)}
          />
          <QuickAction
            icon="receive"
            label="Receive"
            tone="filled"
            onClick={() => navigate(`/receive?coin=${coinId}`)}
          />
          <QuickAction icon="swap" label="Swap" onClick={() => navigate(`/swap?from=${coinId}`)} />
        </div>

        {coin && (
          <section className="bg-surface flex flex-col gap-3 rounded-lg p-4">
            <h2 className="font-semibold">Market stats</h2>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
              {[
                ['Market cap', formatCompactFiat(coin.market_cap, currency)],
                ['24h volume', formatCompactFiat(coin.total_volume, currency)],
                ['24h high', formatFiat(coin.high_24h, currency)],
                ['24h low', formatFiat(coin.low_24h, currency)],
                ['Rank', `#${coin.market_cap_rank}`],
                ['Supply', `${formatCompactNumber(coin.circulating_supply)} ${symbol}`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="text-caption text-text-muted">{label}</dt>
                  <dd className="numeric font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {recent.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent activity</h2>
              <Link to="/activity" className="text-small text-primary font-semibold">
                See all
              </Link>
            </div>
            <div className="bg-surface rounded-lg px-4">
              {recent.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  symbols={symbols}
                  currency={currency}
                  usdRate={usdRate}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
