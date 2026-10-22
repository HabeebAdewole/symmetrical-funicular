import { Icon, type IconName } from '@/components/icons/Icon'
import { cx } from '@/lib/cx'
import {
  formatCrypto,
  formatFiat,
  formatRelativeTime,
  shortenAddress,
  type FiatCurrency,
} from '@/lib/format'
import { transactionTitle } from '@/lib/transactions'
import type { Transaction, TransactionStatus } from '@/mocks/wallet'

const typeIcon: Record<Transaction['type'], IconName> = {
  send: 'send',
  receive: 'receive',
  swap: 'swap',
}

const statusStyle: Record<Exclude<TransactionStatus, 'completed'>, string> = {
  pending: 'text-warning',
  failed: 'text-negative',
}

type TransactionRowProps = {
  tx: Transaction
  /** coinId → ticker, e.g. { bitcoin: 'BTC' } */
  symbols: Record<string, string>
  currency: FiatCurrency
  /** Converts the stored USD value into the user's currency */
  usdRate?: number
  /** Makes the row tappable (opens the detail sheet) */
  onClick?: () => void
}

/** One line of history (Figma: Transaction Row). Received amounts are green; pending/failed get a badge. */
export function TransactionRow({
  tx,
  symbols,
  currency,
  usdRate = 1,
  onClick,
}: TransactionRowProps) {
  const sym = (id?: string) => (id ? (symbols[id] ?? id.toUpperCase()) : '')
  const title = transactionTitle(tx, symbols)
  const detail =
    tx.type === 'swap'
      ? `Got ${formatCrypto(tx.toAmount ?? 0, sym(tx.toCoinId))}`
      : `${tx.type === 'send' ? 'To' : 'From'} ${shortenAddress(tx.counterparty ?? '')}`
  const sign = tx.type === 'receive' ? '+' : '−'

  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'flex w-full items-center gap-3 py-3 text-left',
        onClick && 'active:bg-surface-raised -mx-2 rounded-md px-2 transition-colors',
      )}
    >
      <span className="bg-surface-raised flex size-10 shrink-0 items-center justify-center rounded-full">
        <Icon name={typeIcon[tx.type]} size={20} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-semibold">{title}</span>
        <span className="text-caption text-text-muted truncate">
          {detail} · {formatRelativeTime(tx.timestamp)}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-0.5">
        <span
          className={cx(
            'numeric font-semibold',
            tx.type === 'receive' && 'text-positive',
            tx.status === 'failed' && 'line-through opacity-60',
          )}
        >
          {sign}
          {formatCrypto(tx.amount, sym(tx.coinId))}
        </span>
        {tx.status === 'completed' ? (
          <span className="numeric text-caption text-text-muted">
            {formatFiat(tx.valueUsd * usdRate, currency)}
          </span>
        ) : (
          <span
            className={cx(
              'bg-surface-raised text-caption flex items-center gap-1.5 rounded-full px-2 py-0.5 capitalize',
              statusStyle[tx.status],
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {tx.status}
          </span>
        )}
      </span>
    </Wrapper>
  )
}
