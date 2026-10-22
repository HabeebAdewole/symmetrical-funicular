// Starter balances + transaction history given to every new (or imported) demo wallet.
// Generated from the seed phrase, so the same phrase always produces the same history.

import { deriveMockAddress, networkForCoin } from '@/lib/mockCrypto'
import { hashString, seededRandom } from '@/lib/random'
import { getMockMarkets } from '@/mocks/markets'

export type Holding = {
  coinId: string
  amount: number
}

export type TransactionType = 'send' | 'receive' | 'swap'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export type Transaction = {
  id: string
  type: TransactionType
  coinId: string
  amount: number
  /** Only for swaps: what you received */
  toCoinId?: string
  toAmount?: number
  /** USD value at the time of the transaction */
  valueUsd: number
  /** The other side: recipient for sends, sender for receives */
  counterparty?: string
  /** Network fee, in the same coin */
  fee: number
  status: TransactionStatus
  /** ms since epoch */
  timestamp: number
  /** Fake transaction hash, shown on the detail view */
  hash: string
}

export const STARTER_HOLDINGS: Holding[] = [
  { coinId: 'bitcoin', amount: 0.0842 },
  { coinId: 'ethereum', amount: 1.315 },
  { coinId: 'solana', amount: 18.6 },
  { coinId: 'usd-coin', amount: 1250 },
  { coinId: 'chainlink', amount: 42.5 },
  { coinId: 'dogecoin', amount: 3100 },
]

const DAY = 24 * 60 * 60 * 1000

export function createStarterTransactions(seedPhrase: string[], now = Date.now()): Transaction[] {
  const rand = seededRandom(hashString(seedPhrase.join(' ') + 'history'))
  const usdPrice = Object.fromEntries(getMockMarkets('usd').map((c) => [c.id, c.current_price]))
  const coins = STARTER_HOLDINGS.map((h) => h.coinId)
  const pick = <T>(items: T[]) => items[Math.floor(rand() * items.length)]
  const hex = (length: number) =>
    Array.from({ length }, () => Math.floor(rand() * 16).toString(16)).join('')

  const transactions: Transaction[] = []
  for (let i = 0; i < 30; i++) {
    const type: TransactionType = pick(['receive', 'receive', 'send', 'send', 'swap'])
    const coinId = pick(coins)
    const price = usdPrice[coinId]
    // Each transaction is worth $20–$800
    const valueUsd = Math.round((20 + rand() * 780) * 100) / 100
    const amount = valueUsd / price
    // Spread over the last 60 days, newest first after sorting
    const timestamp = now - Math.floor(rand() * 60 * DAY)
    // A fake "other wallet": a random phrase gives a random-looking address
    const counterparty = deriveMockAddress([hex(16)], networkForCoin(coinId))

    const tx: Transaction = {
      id: `tx_${hex(10)}`,
      type,
      coinId,
      amount,
      valueUsd,
      fee: amount * 0.002,
      status: 'completed',
      timestamp,
      hash: '0x' + hex(64),
    }

    if (type === 'swap') {
      const toCoinId = pick(coins.filter((c) => c !== coinId))
      tx.toCoinId = toCoinId
      tx.toAmount = (valueUsd * 0.997) / usdPrice[toCoinId] // 0.3% swap fee
    } else {
      tx.counterparty = counterparty
    }
    transactions.push(tx)
  }

  transactions.sort((a, b) => b.timestamp - a.timestamp)
  // Make the newest one "pending" and one older one "failed", so the UI has every state to show
  transactions[0].status = 'pending'
  transactions[7].status = 'failed'
  return transactions
}
