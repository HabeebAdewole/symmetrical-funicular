import { useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { Screen } from '@/components/ui/Screen'
import { TopBar } from '@/components/ui/TopBar'
import { cx } from '@/lib/cx'
import {
  currencySymbol,
  formatCrypto,
  formatFiat,
  shortenAddress,
  type FiatCurrency,
} from '@/lib/format'
import { haptics } from '@/lib/haptics'

type AmountStepProps = {
  symbol: string
  coinName: string
  /** Price of 1 coin in the user's currency */
  price: number
  balance: number
  /** Network fee, in the coin */
  fee: number
  currency: FiatCurrency
  to: string
  amount: number
  onAmountChange: (coinAmount: number) => void
  onBack: () => void
  onNext: () => void
}

type Mode = 'fiat' | 'coin'

/**
 * Turns a number back into keypad text without float noise (0.1 + 0.2 → "0.3").
 * Rounds DOWN, so "Max" can never round up past your balance.
 */
const toEntry = (value: number, decimals: number) => {
  const factor = 10 ** decimals
  const floored = Math.floor(value * factor + 1e-9) / factor
  return floored > 0 ? String(Number(floored.toFixed(decimals))) : ''
}

/** "6838.4" → "6,838.4" and "12." stays "12." (keeps exactly what's being typed after the dot) */
const groupDigits = (entry: string) => {
  const [whole, fraction] = entry.split('.')
  const grouped = Number(whole || 0).toLocaleString('en-US')
  return fraction === undefined ? grouped : `${grouped}.${fraction}`
}

/** Send 2/4 (Figma 22:423): type an amount in money or in coin, with 25% / 50% / Max shortcuts. */
export function AmountStep(props: AmountStepProps) {
  const {
    symbol,
    coinName,
    price,
    balance,
    fee,
    currency,
    to,
    amount,
    onAmountChange,
    onBack,
    onNext,
  } = props
  const [mode, setMode] = useState<Mode>('fiat')
  const decimals = mode === 'fiat' ? 2 : 8
  // What the user is typing, exactly as typed ("12." is a valid in-progress entry)
  const [entry, setEntry] = useState(() =>
    toEntry(mode === 'fiat' ? amount * price : amount, decimals),
  )

  const max = Math.max(0, balance - fee)
  const typed = Number(entry) || 0
  const coinAmount = mode === 'fiat' ? (price ? typed / price : 0) : typed
  const tooMuch = coinAmount > max + 1e-12
  const canContinue = coinAmount > 0 && !tooMuch

  const update = (next: string) => {
    setEntry(next)
    const n = Number(next) || 0
    onAmountChange(mode === 'fiat' ? (price ? n / price : 0) : n)
  }

  const press = (key: string) => {
    if (key === '.' && entry.includes('.')) return
    if (key !== '.' && entry.includes('.') && entry.split('.')[1].length >= decimals) return
    if (entry.replace('.', '').length >= 12) return
    // "0" then "5" → "5", but "0" then "." → "0."
    update(entry === '0' && key !== '.' ? key : entry === '' && key === '.' ? '0.' : entry + key)
  }

  const switchMode = () => {
    const next: Mode = mode === 'fiat' ? 'coin' : 'fiat'
    setMode(next)
    setEntry(toEntry(next === 'fiat' ? coinAmount * price : coinAmount, next === 'fiat' ? 2 : 8))
  }

  const setFraction = (fraction: number) => {
    haptics.tap()
    const coins = max * fraction
    onAmountChange(coins)
    setEntry(toEntry(mode === 'fiat' ? coins * price : coins, decimals))
  }

  const shown = groupDigits(entry || '0')
  const main = mode === 'fiat' ? `${currencySymbol(currency)}${shown}` : `${shown} ${symbol}`
  const secondary =
    mode === 'fiat'
      ? `≈ ${formatCrypto(coinAmount, symbol)}`
      : `≈ ${formatFiat(coinAmount * price, currency)}`

  return (
    <Screen
      header={<TopBar title={`Send ${coinName}`} onBack={onBack} />}
      footer={
        <Button disabled={!canContinue} onClick={onNext}>
          Review
        </Button>
      }
      centered
      className="gap-4"
    >
      <p className="text-small text-text-muted pt-4">To {shortenAddress(to)}</p>
      <p
        aria-live="polite"
        className={cx(
          'numeric max-w-full truncate text-[3rem] leading-[3.5rem] font-extrabold',
          tooMuch && 'text-negative',
        )}
      >
        {main}
      </p>
      <button
        type="button"
        onClick={switchMode}
        aria-label={`Switch to typing in ${mode === 'fiat' ? symbol : currency.toUpperCase()}`}
        className="bg-surface-raised text-small numeric flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold"
      >
        {secondary} <Icon name="swap" size={16} />
      </button>

      <div className="flex gap-2">
        {[
          ['25%', 0.25],
          ['50%', 0.5],
          ['Max', 1],
        ].map(([label, fraction]) => (
          <button
            key={label}
            type="button"
            onClick={() => setFraction(fraction as number)}
            className="bg-surface border-border text-small rounded-full border px-4 py-1.5 font-semibold"
          >
            {label}
          </button>
        ))}
      </div>

      <p className={cx('text-caption numeric', tooMuch ? 'text-negative' : 'text-text-muted')}>
        {tooMuch
          ? `Not enough ${symbol}. Max is ${formatCrypto(max, symbol)} after the network fee.`
          : `Available: ${formatCrypto(balance, symbol)} · ${formatFiat(balance * price, currency)}`}
      </p>

      <div className="mt-auto w-full">
        <PinKeypad decimal compact onDigit={press} onBackspace={() => update(entry.slice(0, -1))} />
      </div>
    </Screen>
  )
}
