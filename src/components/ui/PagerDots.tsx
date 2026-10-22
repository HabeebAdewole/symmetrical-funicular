import { cx } from '@/lib/cx'

/** Carousel position indicator. The active dot stretches into a pill. */
export function PagerDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cx(
            'h-2 rounded-full transition-all duration-300',
            i === active ? 'bg-primary w-6' : 'bg-border w-2',
          )}
        />
      ))}
    </div>
  )
}
