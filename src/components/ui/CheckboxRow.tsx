import type { ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'
import { cx } from '@/lib/cx'

type CheckboxRowProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

/**
 * Tappable acknowledgement card. Uses a real (visually hidden) checkbox,
 * so keyboard and screen readers work for free.
 */
export function CheckboxRow({ checked, onChange, children }: CheckboxRowProps) {
  return (
    <label
      className={cx(
        'bg-surface text-small flex cursor-pointer items-start gap-3 rounded-lg p-4 transition-colors',
        'has-focus-visible:outline-primary has-focus-visible:outline-2',
        checked ? 'border-primary border-2' : 'border-border border',
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className={cx(
          'flex size-6 shrink-0 items-center justify-center rounded-sm',
          checked ? 'bg-primary text-on-primary' : 'border-border border-2',
        )}
      >
        {checked && <Icon name="check" size={16} />}
      </span>
      <span>{children}</span>
    </label>
  )
}
