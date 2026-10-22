import { useMemo } from 'react'
import { cx } from '@/lib/cx'

type SparklineProps = {
  values: number[]
  /** Colour the line green (up) or red (down) */
  positive: boolean
  width?: number
  height?: number
}

/**
 * Tiny 7-day trend line for list rows.
 * Hand-drawn SVG instead of a chart library: a list can have dozens of these,
 * and a single <path> is far cheaper than a full chart component.
 */
export function Sparkline({ values, positive, width = 64, height = 28 }: SparklineProps) {
  const path = useMemo(() => {
    if (values.length < 2) return ''
    // Thin out to ~30 points; 168 hourly points is more detail than 64px can show
    const step = Math.max(1, Math.floor(values.length / 30))
    const points = values.filter((_, i) => i % step === 0 || i === values.length - 1)
    const min = Math.min(...points)
    const range = Math.max(...points) - min || 1
    return points
      .map((v, i) => {
        const x = (i / (points.length - 1)) * width
        const y = height - 2 - ((v - min) / range) * (height - 4) // 2px padding top and bottom
        return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
  }, [values, width, height])

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cx('shrink-0', positive ? 'text-positive' : 'text-negative')}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
