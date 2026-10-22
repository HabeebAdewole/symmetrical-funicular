import { useId, useMemo } from 'react'
import { cx } from '@/lib/cx'

type AreaSparklineProps = {
  values: number[]
  positive: boolean
  height?: number
}

/**
 * Full-width trend line with a soft gradient underneath (Home's portfolio card).
 * Plain SVG instead of Recharts, so the first screen after unlocking doesn't download a chart library.
 * The viewBox is 100 units wide and stretched to the card (preserveAspectRatio="none");
 * `vector-effect: non-scaling-stroke` keeps the line 2px thick despite the stretching.
 */
export function AreaSparkline({ values, positive, height = 72 }: AreaSparklineProps) {
  const gradientId = useId()

  const { line, area } = useMemo(() => {
    if (values.length < 2) return { line: '', area: '' }
    const min = Math.min(...values)
    const range = Math.max(...values) - min || 1
    const pts = values.map((v, i) => [
      (i / (values.length - 1)) * 100,
      height - 4 - ((v - min) / range) * (height - 8),
    ])
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
    return { line, area: `${line} L100 ${height} L0 ${height} Z` }
  }, [values, height])

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cx('block w-full', positive ? 'text-primary' : 'text-negative')}
      style={{ height }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
