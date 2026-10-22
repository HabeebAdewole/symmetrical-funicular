import { cx } from '@/lib/cx'

type FilterChipsProps<T extends string> = {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}

/**
 * Horizontal, swipeable row of filter pills (Figma: Filter Chip).
 * Generic <T> means the value type is whatever you pass in, e.g. 'all' | 'gainers'.
 */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: FilterChipsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5"
    >
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
              'text-small shrink-0 rounded-full px-4 py-2 font-semibold transition-colors',
              selected ? 'bg-text text-bg' : 'bg-surface border-border border',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
