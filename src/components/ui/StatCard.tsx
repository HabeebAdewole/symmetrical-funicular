import { formatPercent } from '@/lib/format'
import { cx } from '@/lib/cx'

/** Small labelled number card, e.g. "Market cap · $2.74T · −1.2%". */
export function StatCard({
  label,
  value,
  change,
}: {
  label: string
  value: string
  change?: number
}) {
  return (
    <div className="bg-surface flex flex-1 flex-col gap-1 rounded-lg px-4 py-3.5">
      <span className="text-caption text-text-muted">{label}</span>
      <span className="numeric text-h2 font-bold">{value}</span>
      {change !== undefined && (
        <span
          className={cx('numeric text-caption', change >= 0 ? 'text-positive' : 'text-negative')}
        >
          {formatPercent(change)}
        </span>
      )}
    </div>
  )
}
