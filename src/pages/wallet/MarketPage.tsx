import { useMemo, useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { FilterChips } from '@/components/ui/FilterChips'
import { MarketRow } from '@/components/ui/MarketRow'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatCard } from '@/components/ui/StatCard'
import { useGlobalMarket } from '@/hooks/useGlobalMarket'
import { useMarkets } from '@/hooks/useMarkets'
import { formatCompactFiat } from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

type Filter = 'all' | 'gainers' | 'losers' | 'stable'

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'gainers', label: 'Gainers' },
  { value: 'losers', label: 'Losers' },
  { value: 'stable', label: 'Stablecoins' },
]

const STABLECOINS = ['tether', 'usd-coin']

const emptyMessage: Record<Filter, string> = {
  all: 'No coins to show right now',
  gainers: 'No coins are up in the last 24 hours',
  losers: 'No coins are down in the last 24 hours',
  stable: 'No stablecoins found',
}

export default function MarketPage() {
  const currency = useWalletStore((s) => s.currency)
  const markets = useMarkets()
  const global = useGlobalMarket()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  // Search + filter run only when their inputs change (useMemo), not on every render
  const coins = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Match the start of the symbol or of any word in the name ("eth" → Ethereum, not T-eth-er)
    const matches = (c: { name: string; symbol: string }) =>
      c.symbol.toLowerCase().startsWith(q) ||
      c.name
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.startsWith(q))
    let list = (markets.data?.coins ?? []).filter((c) => !q || matches(c))
    const change = (c: (typeof list)[number]) => c.price_change_percentage_24h ?? 0
    if (filter === 'gainers')
      list = list.filter((c) => change(c) > 0).sort((a, b) => change(b) - change(a))
    if (filter === 'losers')
      list = list.filter((c) => change(c) < 0).sort((a, b) => change(a) - change(b))
    if (filter === 'stable') list = list.filter((c) => STABLECOINS.includes(c.id))
    return list
  }, [markets.data, query, filter])

  const offline = markets.data?.isFallback || global.data?.isFallback

  return (
    <div className="flex flex-col gap-4 px-5 pt-3 pb-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-h1 font-bold">Market</h1>
        {offline && (
          <span className="bg-surface-raised text-caption text-text-muted rounded-full px-2.5 py-1">
            Sample data · offline
          </span>
        )}
      </header>

      <label className="bg-surface border-border focus-within:border-primary flex h-12 items-center gap-2.5 rounded-full border px-4 focus-within:border-2">
        <Icon name="search" size={20} className="text-text-muted shrink-0" />
        <span className="sr-only">Search coins</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coins"
          autoComplete="off"
          className="placeholder:text-text-muted min-w-0 flex-1 bg-transparent outline-none"
        />
      </label>

      <FilterChips label="Filter coins" options={filters} value={filter} onChange={setFilter} />

      <div className="flex gap-3">
        {global.data ? (
          <>
            <StatCard
              label="Market cap"
              value={formatCompactFiat(global.data.totalMarketCap, currency)}
              change={global.data.marketCapChange24h}
            />
            <StatCard
              label="24h volume"
              value={formatCompactFiat(global.data.totalVolume, currency)}
              change={global.data.volumeChange24h}
            />
          </>
        ) : (
          <>
            <Skeleton className="h-22 flex-1 rounded-lg" />
            <Skeleton className="h-22 flex-1 rounded-lg" />
          </>
        )}
      </div>

      <section aria-label="Coins" className="bg-surface rounded-lg px-4 py-2">
        {markets.isLoading ? (
          Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : coins.length > 0 ? (
          coins.map((coin) => <MarketRow key={coin.id} coin={coin} currency={currency} />)
        ) : (
          <p className="text-text-muted py-8 text-center">
            {query ? `No coins match “${query}”` : emptyMessage[filter]}
          </p>
        )}
      </section>
    </div>
  )
}
