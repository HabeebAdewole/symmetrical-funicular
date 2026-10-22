import { useMemo } from 'react'
import type { IconName } from '@/components/icons/Icon'
import { useMarketLookup } from '@/hooks/useMarketLookup'
import { formatCrypto, formatFiat } from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

export type Notification = {
  /** Stable id, so "read" survives reloads: tx:<id>:<status>, price:<coin>:<day>, welcome */
  id: string
  title: string
  body: string
  time: number
  icon: IconName
  /** Where tapping it goes */
  link: string
  unread: boolean
}

/** A held coin moving at least this much in 24h earns a notification */
const PRICE_ALERT_PERCENT = 3
const MAX_ITEMS = 40

/**
 * Notifications are DERIVED from the wallet, not stored: transactions, big price moves and a welcome.
 * The store only remembers which ids were read (plus createdAt: anything older than the wallet itself,
 * like the seeded starter history, counts as already read).
 */
export function useNotifications() {
  const transactions = useWalletStore((s) => s.transactions)
  const holdings = useWalletStore((s) => s.holdings)
  const currency = useWalletStore((s) => s.currency)
  const createdAt = useWalletStore((s) => s.createdAt)
  const readIds = useWalletStore((s) => s.readNotificationIds)
  const { coins, symbols, names, usdRate } = useMarketLookup()

  return useMemo(() => {
    const items: Omit<Notification, 'unread'>[] = []
    const sym = (id?: string) => (id ? (symbols[id] ?? id.toUpperCase()) : '')

    for (const tx of transactions) {
      const amount = formatCrypto(tx.amount, sym(tx.coinId))
      const value = formatFiat(tx.valueUsd * usdRate, currency)
      // The status is part of the id: "Send pending" and "Send confirmed" are two separate notifications
      const base = {
        id: `tx:${tx.id}:${tx.status}`,
        time: tx.timestamp,
        link: `/activity?tx=${tx.id}`,
      }
      if (tx.type === 'receive') {
        items.push({
          ...base,
          icon: 'receive',
          title: `You received ${amount}`,
          body: `${value} from ${tx.counterparty?.slice(0, 6)}… is in your wallet.`,
        })
      } else if (tx.status === 'failed') {
        items.push({
          ...base,
          icon: 'alert',
          title: `${tx.type === 'swap' ? 'Swap' : 'Send'} failed`,
          body: `${amount} didn’t go through. Nothing left your wallet.`,
        })
      } else if (tx.type === 'send') {
        items.push({
          ...base,
          icon: 'send',
          title: tx.status === 'pending' ? 'Send pending' : 'Send confirmed',
          body: `${amount} (${value}) to ${tx.counterparty?.slice(0, 6)}…${tx.status === 'pending' ? ' is confirming.' : ' arrived.'}`,
        })
      } else {
        items.push({
          ...base,
          icon: 'swap',
          title: tx.status === 'pending' ? 'Swap in progress' : 'Swap completed',
          body: `${amount} → ${formatCrypto(tx.toAmount ?? 0, sym(tx.toCoinId))}`,
        })
      }
    }

    // Price alerts for coins you hold (once per day)
    const today = new Date().toISOString().slice(0, 10)
    const alertTime = Math.max(new Date(new Date().setHours(0, 0, 0, 0)).getTime(), createdAt + 1) // never "before" the wallet existed
    const movers = holdings
      .map((h) => coins.find((c) => c.id === h.coinId))
      .filter((c) => c && Math.abs(c.price_change_percentage_24h ?? 0) >= PRICE_ALERT_PERCENT)
      .map((c) => ({ coin: c!, change: c!.price_change_percentage_24h ?? 0 }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    const signed = (n: number) => `${n > 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}%`

    if (movers.length >= 3) {
      // A whole-market move: one summary instead of a pile of near-identical alerts
      const allDown = movers.every((m) => m.change < 0)
      const allUp = movers.every((m) => m.change > 0)
      items.push({
        id: `price:summary:${today}`,
        icon: 'market',
        time: alertTime,
        link: '/market',
        title: `${movers.length} of your coins are ${allDown ? 'down' : allUp ? 'up' : 'moving'} today`,
        body: movers.map((m) => `${sym(m.coin.id)} ${signed(m.change)}`).join(' · '),
      })
    } else {
      for (const { coin, change } of movers) {
        items.push({
          id: `price:${coin.id}:${today}`,
          icon: 'market',
          time: alertTime,
          link: `/asset/${coin.id}`,
          title: `${names[coin.id]} is ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}% today`,
          body: `${sym(coin.id)} is trading at ${formatFiat(coin.current_price, currency)}. Tap to see the chart.`,
        })
      }
    }

    if (createdAt) {
      items.push({
        id: 'welcome',
        icon: 'shield',
        time: createdAt + 1,
        link: '/settings',
        title: 'Welcome to Kova',
        body: 'Your wallet is ready. Remember: Kova will never ask for your recovery phrase.',
      })
    }

    const read = new Set(readIds)
    const list: Notification[] = items
      .sort((a, b) => b.time - a.time)
      .slice(0, MAX_ITEMS)
      .map((n) => ({ ...n, unread: n.time > createdAt && !read.has(n.id) }))

    return { notifications: list, unreadCount: list.filter((n) => n.unread).length }
  }, [transactions, holdings, currency, createdAt, readIds, coins, symbols, names, usdRate])
}
