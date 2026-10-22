import { useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useMarketLookup } from '@/hooks/useMarketLookup'
import { copyText } from '@/lib/clipboard'
import { cx } from '@/lib/cx'
import { formatDateTime } from '@/lib/dates'
import { formatCrypto, formatFiat, shortenAddress } from '@/lib/format'
import { haptics } from '@/lib/haptics'
import { networkOf } from '@/lib/networks'
import { transactionTitle } from '@/lib/transactions'
import { useWalletStore } from '@/store/walletStore'

const statusLabel = { completed: 'Confirmed', pending: 'Pending', failed: 'Failed' } as const
const statusColor = {
  completed: 'text-positive',
  pending: 'text-warning',
  failed: 'text-negative',
} as const

/** Detail row whose value can be copied (addresses, hashes) */
function CopyRow({ label, value, display }: { label: string; value: string; display: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-small text-text-muted">{label}</dt>
      <dd>
        <button
          type="button"
          onClick={async () => {
            if (await copyText(value)) {
              haptics.tap()
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }
          }}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="text-small numeric flex items-center gap-1.5 font-semibold"
        >
          {copied ? 'Copied' : display}
          <Icon name={copied ? 'check' : 'copy'} size={16} className="text-text-muted" />
        </button>
      </dd>
    </div>
  )
}

/** Everything about one transaction (opens from Activity rows and notifications). Updates live. */
export function TransactionDetailSheet({
  txId,
  onClose,
}: {
  txId: string | null
  onClose: () => void
}) {
  const tx = useWalletStore((s) => s.transactions.find((t) => t.id === txId))
  const currency = useWalletStore((s) => s.currency)
  const { symbols, usdRate } = useMarketLookup()

  const sym = (id?: string) => (id ? (symbols[id] ?? id.toUpperCase()) : '')

  return (
    <BottomSheet open={!!tx} onClose={onClose} title={tx ? transactionTitle(tx, symbols) : ''}>
      {tx && (
        <>
          <div className="flex flex-col items-center gap-1 py-2 text-center">
            <span
              className={cx(
                'numeric text-display font-extrabold',
                tx.type === 'receive' && 'text-positive',
                tx.status === 'failed' && 'line-through opacity-60',
              )}
            >
              {tx.type === 'receive' ? '+' : '−'}
              {formatCrypto(tx.amount, sym(tx.coinId))}
            </span>
            {tx.type === 'swap' && (
              <span className="numeric text-positive font-semibold">
                +{formatCrypto(tx.toAmount ?? 0, sym(tx.toCoinId))}
              </span>
            )}
            <span className="numeric text-text-muted">
              {formatFiat(tx.valueUsd * usdRate, currency)}
            </span>
            <span
              className={cx(
                'bg-surface-raised text-caption mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium',
                statusColor[tx.status],
              )}
            >
              <span
                className={cx(
                  'size-1.5 rounded-full bg-current',
                  tx.status === 'pending' && 'animate-pulse',
                )}
              />
              {statusLabel[tx.status]}
            </span>
          </div>

          <dl className="bg-surface-raised flex flex-col gap-3 rounded-lg p-4">
            <div className="flex justify-between gap-4">
              <dt className="text-small text-text-muted">Date</dt>
              <dd className="text-small font-semibold">{formatDateTime(tx.timestamp)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              {/* A swap is an exchange inside Kova, not a transfer on a coin's network */}
              <dt className="text-small text-text-muted">
                {tx.type === 'swap' ? 'Exchange' : 'Network'}
              </dt>
              <dd className="text-small font-semibold">
                {tx.type === 'swap' ? 'Kova Swap (0.3% fee)' : networkOf(tx.coinId).name}
              </dd>
            </div>
            {tx.counterparty && (
              <CopyRow
                label={tx.type === 'send' ? 'To' : 'From'}
                value={tx.counterparty}
                display={shortenAddress(tx.counterparty, 6)}
              />
            )}
            {/* Swap fees are already taken out of the amount received, so only sends show one */}
            {tx.type === 'send' && tx.fee > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-small text-text-muted">Network fee</dt>
                <dd className="text-small numeric font-semibold">
                  {formatCrypto(Number(tx.fee.toPrecision(2)), sym(tx.coinId))}
                </dd>
              </div>
            )}
            <CopyRow label="Transaction ID" value={tx.hash} display={shortenAddress(tx.hash, 6)} />
          </dl>

          {tx.status === 'failed' && (
            <p className="text-small text-text-muted text-center">
              This transaction didn’t go through, so no money left your wallet.
            </p>
          )}
        </>
      )}
    </BottomSheet>
  )
}
