import { cx } from '@/lib/cx'

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}

/** Equal-width toggle group, e.g. the chart's 1D / 1W / 1M / 1Y picker (Figma: Segmented Control). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="bg-surface-raised flex rounded-full p-1">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cx(
              'text-small h-8 flex-1 rounded-full font-semibold transition-colors',
              selected ? 'bg-surface text-text shadow-card' : 'text-text-muted',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
