import { cx } from '@/lib/cx'

type PinDotsProps = {
  filled: number
  length?: number
  /** Shake + turn red after a wrong PIN */
  error?: boolean
}

/** Row of dots showing how many PIN digits have been typed. */
export function PinDots({ filled, length = 6, error }: PinDotsProps) {
  return (
    <div
      role="status"
      aria-label={`${filled} of ${length} digits entered`}
      className={cx('flex gap-4', error && 'animate-shake')}
    >
      {Array.from({ length }, (_, i) => (
        <span
          key={i}
          className={cx(
            'size-4 rounded-full transition-colors',
            i < filled ? (error ? 'bg-negative' : 'bg-primary') : 'border-border border-2',
          )}
        />
      ))}
    </div>
  )
}
