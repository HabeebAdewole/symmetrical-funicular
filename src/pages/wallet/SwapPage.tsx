import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { SwapCard } from '@/components/swap/SwapCard'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { AssetPickerSheet } from '@/components/wallet/AssetPickerSheet'
import { PinConfirmSheet } from '@/components/wallet/PinConfirmSheet'
import { useMarketCoin, useMarkets } from '@/hooks/useMarkets'
import { formatCrypto, formatFiat } from '@/lib/format'
import { haptics } from '@/lib/haptics'
import { newTransactionMeta } from '@/lib/transactions'
import { networkOf } from '@/lib/networks'
import { KOVA_FEE_RATE, quoteSwap } from '@/lib/swapQuote'
import { useWalletStore } from '@/store/walletStore'

type Side = 'from' | 'to'

/** Keeps only a valid decimal number as the user types ("1,5" → "1.5", max 8 decimals) */
const cleanEntry = (raw: string) => {
  const [whole, ...rest] = raw
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
    .split('.')
  return rest.length ? `${whole || '0'}.${rest.join('').slice(0, 8)}` : whole
}

/** Rounds DOWN to 8 decimals, so "Max" never exceeds the balance */
const toEntry = (n: number) => (n > 0 ? String(Math.floor(n * 1e8 + 1e-6) / 1e8) : '')

export default function SwapPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const holdings = useWalletStore((s) => s.holdings)
  const currency = useWalletStore((s) => s.currency)
  const addTransaction = useWalletStore((s) => s.addTransaction)
  const markets = useMarkets()

  const [fromId, setFromId] = useState(() => {
    const wanted = params.get('from')
    return wanted && holdings.some((h) => h.coinId === wanted)
      ? wanted
      : (holdings[0]?.coinId ?? 'bitcoin')
  })
  const [toId, setToId] = useState(() => (fromId === 'usd-coin' ? 'bitcoin' : 'usd-coin'))
  const [entry, setEntry] = useState('')
  const [picking, setPicking] = useState<Side | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const [done, setDone] = useState<{ paid: string; got: string } | null>(null)

  const { coin: from } = useMarketCoin(fromId)
  const { coin: to } = useMarketCoin(toId)

  // Prices come in the user's currency; USDC's price in that currency is the USD exchange rate
  const usdRate = markets.data?.coins.find((c) => c.id === 'usd-coin')?.current_price ?? 1
  const fromPriceUsd = (from?.current_price ?? 0) / usdRate
  const toPriceUsd = (to?.current_price ?? 0) / usdRate
  const amount = Number(entry) || 0
  const quote = quoteSwap(amount, fromPriceUsd, toPriceUsd, networkOf(fromId).feeUsd)
  const balance = holdings.find((h) => h.coinId === fromId)?.amount ?? 0
  const tooMuch = amount > balance + 1e-12
  const canReview = amount > 0 && !tooMuch && quote.toAmount > 0

  const fromSym = from?.symbol.toUpperCase() ?? ''
  const toSym = to?.symbol.toUpperCase() ?? ''
  const fiat = (usd: number) => formatFiat(usd * usdRate, currency)
  // Fees read best in whole cents ($0.46, not $0.4642)
  const fiatFee = (usd: number) => formatFiat(Math.round(usd * usdRate * 100) / 100, currency)

  const flip = () => {
    haptics.tap()
    setFromId(toId)
    setToId(fromId)
    setEntry(toEntry(quote.toAmount)) // what you'd have received becomes what you pay
  }

  const pick = (id: string) => {
    const other = picking === 'from' ? toId : fromId
    if (id === other) return flip() // same coin on both sides = flip them
    if (picking === 'from') {
      setFromId(id)
      setEntry('')
    } else {
      setToId(id)
    }
  }

  const swap = () => {
    addTransaction({
      ...newTransactionMeta(),
      type: 'swap',
      coinId: fromId,
      amount,
      toCoinId: toId,
      toAmount: quote.toAmount,
      valueUsd: quote.valueUsd,
      fee: 0, // fees are already taken out of toAmount by the quote
      status: 'pending',
    })
    haptics.success()
    setPinOpen(false)
    setDone({ paid: formatCrypto(amount, fromSym), got: formatCrypto(quote.toAmount, toSym) })
    setEntry('')
  }

  const details: [string, string][] = [
    ['Rate', `1 ${fromSym} = ${formatCrypto(Number(quote.rate.toPrecision(6)), toSym)}`],
    [`Kova fee (${KOVA_FEE_RATE * 100}%)`, fiatFee(quote.kovaFeeUsd)],
    [`Network fee (${networkOf(fromId).name})`, fiatFee(networkOf(fromId).feeUsd)],
  ]

  return (
    <div className="flex flex-col gap-4 px-5 pt-3 pb-4">
      <h1 className="text-h1 font-bold">Swap</h1>

      {/* Two cards with the flip button overlapping the gap between them */}
      <div className="relative flex flex-col gap-2">
        <SwapCard
          label="You pay"
          coin={from}
          onPickCoin={() => setPicking('from')}
          value={entry}
          onChange={(v) => setEntry(cleanEntry(v))}
          error={tooMuch}
          action={
            <button
              type="button"
              onClick={() => setEntry(toEntry(balance))}
              className="text-small text-primary font-semibold"
            >
              Max
            </button>
          }
          footer={
            tooMuch
              ? `Not enough ${fromSym}. You have ${formatCrypto(balance, fromSym)}.`
              : `≈ ${fiat(quote.valueUsd)} · Balance ${formatCrypto(balance, fromSym)}`
          }
        />
        <button
          type="button"
          onClick={flip}
          aria-label="Flip: swap the two coins"
          className="bg-surface border-bg absolute top-1/2 left-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 transition-transform active:rotate-180"
        >
          <Icon name="swap" size={20} className="rotate-90" />
        </button>
        <SwapCard
          label="You receive"
          coin={to}
          onPickCoin={() => setPicking('to')}
          value={quote.toAmount > 0 ? String(Number(quote.toAmount.toPrecision(8))) : ''}
          footer={
            quote.toAmount > 0
              ? `≈ ${fiat(quote.toAmount * toPriceUsd)} after fees`
              : 'Enter an amount to see a quote'
          }
        />
      </div>

      <dl className="bg-surface flex flex-col gap-3 rounded-lg p-4">
        {details.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-small text-text-muted">{label}</dt>
            <dd className="text-small numeric text-right font-semibold">{value}</dd>
          </div>
        ))}
        <p className="text-caption text-text-muted flex items-center gap-1.5">
          <span className="bg-positive size-1.5 animate-pulse rounded-full" />
          {markets.data?.isFallback ? 'Sample prices (offline)' : 'Live rate, updates every minute'}
        </p>
      </dl>

      <Button disabled={!canReview} onClick={() => setReviewOpen(true)}>
        Review swap
      </Button>

      <AssetPickerSheet
        open={picking !== null}
        onClose={() => setPicking(null)}
        selectedId={picking === 'from' ? fromId : toId}
        onSelect={pick}
        onlyOwned={picking === 'from'}
        title={picking === 'from' ? 'Swap from' : 'Swap to'}
      />

      <BottomSheet open={reviewOpen} onClose={() => setReviewOpen(false)} title="Review swap">
        <div className="bg-surface-raised flex flex-col gap-1 rounded-lg p-4">
          <span className="text-caption text-text-muted">You pay</span>
          <span className="numeric text-h2 font-bold">{formatCrypto(amount, fromSym)}</span>
          <span className="text-caption text-text-muted pt-2">You receive (after fees)</span>
          <span className="numeric text-h2 text-positive font-bold">
            {formatCrypto(quote.toAmount, toSym)}
          </span>
        </div>
        <dl className="flex flex-col gap-2.5">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-small text-text-muted">{label}</dt>
              <dd className="text-small numeric font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <Button
          onClick={() => {
            setReviewOpen(false)
            setPinOpen(true)
          }}
        >
          Confirm swap
        </Button>
      </BottomSheet>

      <PinConfirmSheet
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onConfirmed={swap}
        title="Confirm swap"
      />

      <BottomSheet open={done !== null} onClose={() => setDone(null)} title="Swap submitted">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span className="bg-highlight text-on-highlight animate-pop-in flex size-16 items-center justify-center rounded-full">
            <Icon name="check" size={32} />
          </span>
          <p className="numeric">
            Swapped <strong>{done?.paid}</strong> for <strong>{done?.got}</strong>.
          </p>
          <p className="text-small text-text-muted">
            It’ll confirm in a few seconds. Both balances are already updated.
          </p>
        </div>
        <Button onClick={() => setDone(null)}>Done</Button>
        <Button variant="ghost" onClick={() => navigate('/activity')}>
          View in Activity
        </Button>
      </BottomSheet>
    </div>
  )
}
