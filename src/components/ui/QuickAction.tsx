import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from '@/components/icons/Icon'
import { cx } from '@/lib/cx'

type QuickActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  label: string
  /** Figma: Style=Filled (lime) | Soft (neutral) */
  tone?: 'filled' | 'soft'
}

/** Round 56px action with a label underneath — Home's Send / Receive / Swap / Buy row. */
export function QuickAction({ icon, label, tone = 'soft', className, ...props }: QuickActionProps) {
  return (
    <button
      type="button"
      className={cx('group text-small flex flex-col items-center gap-2 font-semibold', className)}
      {...props}
    >
      <span
        className={cx(
          'flex size-14 items-center justify-center rounded-full transition-transform group-active:scale-95',
          tone === 'filled' ? 'bg-highlight text-on-highlight' : 'bg-surface-raised text-text',
        )}
      >
        <Icon name={icon} />
      </span>
      {label}
    </button>
  )
}
