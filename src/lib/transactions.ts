// Shared helpers for creating mock transactions (Send, Swap…).

const randomHex = (bytes: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')

/** A fresh id, timestamp and fake on-chain hash for a new transaction */
export function newTransactionMeta() {
  return {
    id: `tx_${randomHex(5)}`,
    timestamp: Date.now(),
    hash: `0x${randomHex(32)}`,
  }
}

type TitleTx = { type: 'send' | 'receive' | 'swap'; coinId: string; toCoinId?: string }

/** "Sent BTC", "Received ETH", "Swapped SOL → USDC" */
export function transactionTitle(tx: TitleTx, symbols: Record<string, string>) {
  const sym = (id?: string) => (id ? (symbols[id] ?? id.toUpperCase()) : '')
  if (tx.type === 'send') return `Sent ${sym(tx.coinId)}`
  if (tx.type === 'receive') return `Received ${sym(tx.coinId)}`
  return `Swapped ${sym(tx.coinId)} → ${sym(tx.toCoinId)}`
}
