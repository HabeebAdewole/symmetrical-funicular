import { Button } from '@/components/ui/Button'
import { CoinLogo } from '@/components/ui/CoinLogo'
import { NoticeCard } from '@/components/ui/NoticeCard'
import { Screen } from '@/components/ui/Screen'
import { TopBar } from '@/components/ui/TopBar'
import { formatCrypto, formatFiat, shortenAddress, type FiatCurrency } from '@/lib/format'

type ReviewStepProps = {
  image?: string
  symbol: string
  networkName: string
  eta: string
  amount: number
  fee: number
  price: number
  currency: FiatCurrency
  to: string
  onBack: () => void
  onConfirm: () => void
}

/** Send 3/4 (Figma 22:496): last look before money moves. */
export function ReviewStep(props: ReviewStepProps) {
  const { image, symbol, networkName, eta, amount, fee, price, currency, to, onBack, onConfirm } =
    props
  const rows: [string, string][] = [
    ['To', shortenAddress(to, 6)],
    ['Network', networkName],
    [
      'Network fee',
      `${formatCrypto(Number(fee.toPrecision(2)), symbol)} · ${formatFiat(Math.round(fee * price * 100) / 100, currency)}`,
    ],
    ['Arrives in', eta],
  ]

  return (
    <Screen
      header={<TopBar title="Review" onBack={onBack} />}
      footer={
        <>
          <Button onClick={onConfirm}>Confirm and send</Button>
          <Button variant="ghost" onClick={onBack}>
            Edit amount
          </Button>
        </>
      }
    >
      <section className="flex flex-col items-center gap-1 pt-2 text-center">
        <CoinLogo image={image} symbol={symbol} size={56} />
        <span className="text-small text-text-muted pt-2">You’re sending</span>
        <span className="numeric text-display font-extrabold">{formatCrypto(amount, symbol)}</span>
        <span className="numeric text-text-muted">{formatFiat(amount * price, currency)}</span>
      </section>

      <dl className="bg-surface flex flex-col gap-3.5 rounded-lg p-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-small text-text-muted">{label}</dt>
            <dd className="text-small numeric text-right font-semibold">{value}</dd>
          </div>
        ))}
        <div className="border-border flex justify-between gap-4 border-t pt-3.5">
          <dt className="text-small text-text-muted">Total</dt>
          <dd className="numeric text-right font-bold">
            {formatFiat((amount + fee) * price, currency)}
          </dd>
        </div>
      </dl>

      <NoticeCard tone="warning">
        Crypto sends can’t be reversed. Make sure the address is right before you confirm.
      </NoticeCard>
    </Screen>
  )
}
