import { useNavigate } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { cx } from '@/lib/cx'
import { formatCrypto, formatFiat, shortenAddress, type FiatCurrency } from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

type SuccessStepProps = {
  txId: string
  symbol: string
  amount: number
  price: number
  currency: FiatCurrency
  to: string
  eta: string
}

/** Send 4/4 (Figma 22:555). Watches the transaction live: Pending → Confirmed. */
export function SuccessStep({ txId, symbol, amount, price, currency, to, eta }: SuccessStepProps) {
  const navigate = useNavigate()
  const status = useWalletStore(
    (s) => s.transactions.find((t) => t.id === txId)?.status ?? 'pending',
  )
  const confirmed = status === 'completed'

  return (
    <Screen
      centered
      className="justify-center"
      footer={
        <>
          <Button onClick={() => navigate('/', { replace: true })}>Done</Button>
          <Button variant="ghost" onClick={() => navigate('/activity', { replace: true })}>
            View in Activity
          </Button>
        </>
      }
    >
      <span className="bg-surface-raised animate-pop-in flex size-32 items-center justify-center rounded-full">
        <span className="bg-highlight text-on-highlight flex size-24 items-center justify-center rounded-full">
          <Icon name="check" size={48} />
        </span>
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Sent!</h1>
        <p className="text-text-muted numeric">
          {formatCrypto(amount, symbol)} ({formatFiat(amount * price, currency)}) is on its way to{' '}
          {shortenAddress(to)}.
        </p>
      </div>
      <div
        aria-live="polite"
        className="bg-surface flex w-full items-center gap-3 rounded-lg p-4 text-left"
      >
        <span
          className={cx(
            'bg-surface-raised text-caption flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-medium',
            confirmed ? 'text-positive' : 'text-warning',
          )}
        >
          <span className={cx('size-1.5 rounded-full bg-current', !confirmed && 'animate-pulse')} />
          {confirmed ? 'Confirmed' : 'Pending'}
        </span>
        <span className="text-small text-text-muted">
          {confirmed
            ? 'The network has confirmed your transaction.'
            : `Usually confirms in ${eta}.`}
        </span>
      </div>
    </Screen>
  )
}
