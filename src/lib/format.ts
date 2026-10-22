// Display helpers. Every number the UI shows should go through one of these,
// so formatting stays consistent across the app.

export type FiatCurrency = 'usd' | 'eur' | 'gbp' | 'ngn'

/** $82,241.00 — small values get more decimals so $0.0796 doesn't show as $0.08 */
export function formatFiat(value: number, currency: FiatCurrency = 'usd') {
  const abs = Math.abs(value)
  const maximumFractionDigits = abs === 0 ? 2 : abs < 1 ? 4 : abs < 10 ? 3 : 2
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    currencyDisplay: 'narrowSymbol', // ₦ instead of NGN
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value)
}

/** $1.65T, $37.4B — for market caps and volumes */
export function formatCompactFiat(value: number, currency: FiatCurrency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    currencyDisplay: 'narrowSymbol', // ₦ instead of NGN
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

/** 0.0512 BTC — trims trailing zeros, caps at 8 decimals (the satoshi) */
export function formatCrypto(amount: number, symbol: string) {
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(amount)
  return `${formatted} ${symbol.toUpperCase()}`
}

/** +2.19% / -0.87% — always signed so up/down is obvious */
export function formatPercent(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/** 0x71C7…976F — the start and end of an address are what people actually compare */
export function shortenAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

/** "5m ago", "3h ago", "2d ago", then a date */
export function formatRelativeTime(date: Date | string | number, now = Date.now()) {
  const then = new Date(date).getTime()
  const seconds = Math.round((now - then) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(then).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
