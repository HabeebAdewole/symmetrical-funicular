import { useState } from 'react'
import { cx } from '@/lib/cx'

/** CoinGecko logo with a letter fallback if the image can't load (offline, blocked, broken URL). */
export function CoinLogo({
  image,
  symbol,
  size = 40,
  className,
}: {
  image?: string
  symbol: string
  size?: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className={cx(
          'bg-surface-raised flex shrink-0 items-center justify-center rounded-full font-bold uppercase',
          className,
        )}
      >
        {symbol[0]}
      </span>
    )
  }
  return (
    <img
      src={image}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cx('shrink-0 rounded-full', className)}
    />
  )
}
