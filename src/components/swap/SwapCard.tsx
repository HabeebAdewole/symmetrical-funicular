import { useId, type ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'
import { CoinLogo } from '@/components/ui/CoinLogo'
import type { MarketCoin } from '@/lib/coingecko'
import { cx } from '@/lib/cx'

type SwapCardProps = {
  label: string
  coin: MarketCoin | undefined
  onPickCoin: () => void
  /** Text in the amount box */
  value: string
  /** Leave undefined for the read-only "You receive" side */
  onChange?: (value: string) => void
  /** Line under the amount: "≈ $156.53 · Balance 18.6 SOL" */
  footer: ReactNode
  error?: boolean
  action?: ReactNode
}

/** One side of a swap (Figma: Swap → "You pay" / "You receive" card). */
export function SwapCard({
  label,
  coin,
  onPickCoin,
  value,
  onChange,
  footer,
  error,
  action,
}: SwapCardProps) {
  const inputId = useId()

  return (
    <section className="bg-surface flex flex-col gap-2 rounded-lg px-4 py-4.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-caption text-text-muted">
          {label}
        </label>
        {action}
      </div>
      <div className="flex items-center justify-between gap-3">
        <input
          id={inputId}
          value={value}
          readOnly={!onChange}
          onChange={(e) => onChange?.(e.target.value)}
          // Phones show a number keyboard with a decimal point
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          aria-invalid={error || undefined}
          className={cx(
            'numeric text-display placeholder:text-text-muted min-w-0 flex-1 bg-transparent font-extrabold outline-none',
            error && 'text-negative',
          )}
        />
        <button
          type="button"
          onClick={onPickCoin}
          aria-label={`Change coin, currently ${coin?.name ?? 'none'}`}
          className="bg-surface-raised flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pr-2.5 pl-1.5"
        >
          <CoinLogo image={coin?.image} symbol={coin?.symbol ?? '?'} size={28} />
          <span className="font-semibold">{coin?.symbol.toUpperCase() ?? '…'}</span>
          <Icon name="chevron-down" size={18} className="text-text-muted" />
        </button>
      </div>
      <div className={cx('text-caption numeric', error ? 'text-negative' : 'text-text-muted')}>
        {footer}
      </div>
    </section>
  )
}
