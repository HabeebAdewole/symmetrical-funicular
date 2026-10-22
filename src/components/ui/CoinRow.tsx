import { useState } from 'react'
import { formatPercent } from '@/lib/format'
import { cx } from '@/lib/cx'

type CoinRowProps = {
  name: string
  symbol: string
  image?: string
  /** Secondary line under the name, e.g. "0.0842 BTC" */
  subtitle: string
  /** Right-hand main value, already formatted, e.g. "$6,924.69" */
  value: string
  /** 24h % change; coloured green/red */
  change?: number
  onClick?: () => void
}

/** Asset row used on Home, Market and the Swap coin picker. */
export function CoinRow({ name, symbol, image, subtitle, value, change, onClick }: CoinRowProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'bg-surface flex h-18 w-full items-center gap-3 rounded-lg px-4 text-left',
        onClick && 'active:bg-surface-raised transition-colors',
      )}
    >
      {image && !imageFailed ? (
        <img
          src={image}
          alt=""
          className="size-10 rounded-full"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        // Fallback when the CoinGecko image can't load: first letter of the symbol
        <span className="bg-surface-raised flex size-10 items-center justify-center rounded-full font-bold uppercase">
          {symbol[0]}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-semibold">{name}</span>
        <span className="numeric text-caption text-text-muted truncate">{subtitle}</span>
      </span>
      <span className="flex flex-col items-end gap-0.5">
        <span className="numeric font-semibold">{value}</span>
        {change !== undefined && (
          <span
            className={cx('numeric text-caption', change >= 0 ? 'text-positive' : 'text-negative')}
          >
            {formatPercent(change)}
          </span>
        )}
      </span>
    </Wrapper>
  )
}
