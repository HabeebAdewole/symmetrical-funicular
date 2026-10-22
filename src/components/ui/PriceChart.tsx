import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PricePoint } from '@/lib/coingecko'
import { cx } from '@/lib/cx'

type PriceChartProps = {
  points: PricePoint[]
  positive: boolean
  height?: number
  /** Called with the point under the finger/cursor (null when released), so the page can show that price */
  onScrub?: (point: PricePoint | null) => void
}

type ChartEvent = { activeTooltipIndex?: number | string | null }

/**
 * Asset price chart (Figma: Price Chart): a line with a soft gradient underneath.
 * Colours use `currentColor`, so the parent's text colour decides: primary when up, negative when down.
 */
export function PriceChart({ points, positive, height = 180, onScrub }: PriceChartProps) {
  const gradientId = useId() // unique per chart so two charts on a page don't share a gradient
  const data = points.map(([time, price]) => ({ time, price }))

  const scrub = (event: ChartEvent) => {
    const index = Number(event?.activeTooltipIndex)
    onScrub?.(Number.isInteger(index) && points[index] ? points[index] : null)
  }

  return (
    <div className={cx('-mx-5', positive ? 'text-primary' : 'text-negative')} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          onMouseMove={scrub}
          onTouchMove={scrub}
          onMouseLeave={() => onScrub?.(null)}
          onTouchEnd={() => onScrub?.(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Axes are hidden, but they still decide the scale: tight to the price range */}
          <XAxis dataKey="time" hide />
          <YAxis domain={['dataMin', 'dataMax']} hide />
          {/* No tooltip box: the page header shows the scrubbed price instead. Just a guide line. */}
          <Tooltip
            content={() => null}
            cursor={{ stroke: 'currentColor', strokeOpacity: 0.4, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="currentColor"
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            animationDuration={400}
            activeDot={{
              r: 5,
              strokeWidth: 3,
              stroke: 'var(--color-surface)',
              fill: 'currentColor',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
