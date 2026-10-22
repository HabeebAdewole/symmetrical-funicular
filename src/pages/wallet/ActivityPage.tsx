import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { TransactionDetailSheet } from '@/components/activity/TransactionDetailSheet'
import { FilterChips } from '@/components/ui/FilterChips'
import { TransactionRow } from '@/components/ui/TransactionRow'
import { useMarketLookup } from '@/hooks/useMarketLookup'
import { groupByDay } from '@/lib/dates'
import type { TransactionType } from '@/mocks/wallet'
import { useWalletStore } from '@/store/walletStore'

type Filter = 'all' | TransactionType

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'send', label: 'Sent' },
  { value: 'receive', label: 'Received' },
  { value: 'swap', label: 'Swaps' },
]

const emptyMessage: Record<Filter, string> = {
  all: 'No activity yet. Sends, receives and swaps will show up here.',
  send: 'You haven’t sent anything yet.',
  receive: 'Nothing received yet. Share your address from Receive.',
  swap: 'No swaps yet. Try one from the Swap tab.',
}

export default function ActivityPage() {
  const transactions = useWalletStore((s) => s.transactions)
  const currency = useWalletStore((s) => s.currency)
  const { symbols, usdRate } = useMarketLookup()
  const [filter, setFilter] = useState<Filter>('all')
  // The open transaction lives in the URL (?tx=…), so notifications can link straight to it
  const [params, setParams] = useSearchParams()
  const openTx = params.get('tx')

  const groups = useMemo(() => {
    const list = transactions
      .filter((t) => filter === 'all' || t.type === filter)
      .toSorted((a, b) => b.timestamp - a.timestamp)
    return groupByDay(list, (t) => t.timestamp)
  }, [transactions, filter])

  return (
    <div className="flex flex-col gap-4 px-5 pt-3 pb-4">
      <h1 className="text-h1 font-bold">Activity</h1>
      <FilterChips label="Filter activity" options={filters} value={filter} onChange={setFilter} />

      {groups.length === 0 ? (
        <p className="text-text-muted py-12 text-center">{emptyMessage[filter]}</p>
      ) : (
        groups.map((group) => (
          <section key={group.label} className="flex flex-col gap-2">
            <h2 className="text-caption text-text-muted">{group.label}</h2>
            <div className="bg-surface rounded-lg px-4 py-1">
              {group.items.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  symbols={symbols}
                  currency={currency}
                  usdRate={usdRate}
                  onClick={() => setParams({ tx: tx.id })}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <TransactionDetailSheet txId={openTx} onClose={() => setParams({}, { replace: true })} />
    </div>
  )
}
