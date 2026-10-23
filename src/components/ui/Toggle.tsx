import { cx } from '@/lib/cx'

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Screen-reader label, e.g. "Price alerts" */
  label: string
}

/** iOS-style on/off switch (Figma: Toggle). role="switch" tells screen readers it's an on/off control. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-7.75 w-12.75 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-border',
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'absolute top-0.5 left-0.5 size-6.75 rounded-full bg-white shadow-[0_2px_4px_rgb(0_0_0/0.15)] transition-transform duration-200',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}
