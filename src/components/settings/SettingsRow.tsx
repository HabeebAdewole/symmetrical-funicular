import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/icons/Icon'
import { cx } from '@/lib/cx'

type SettingsRowProps = {
  icon: IconName
  label: string
  /** Small grey text on the right, e.g. "USD" */
  value?: string
  /** A control on the right instead of a chevron (e.g. <Toggle />) */
  trailing?: ReactNode
  onClick?: () => void
  /** Red text, for destructive rows */
  danger?: boolean
}

/** One settings line (Figma: Settings Row): icon tile, label, value/control, chevron. */
export function SettingsRow({ icon, label, value, trailing, onClick, danger }: SettingsRowProps) {
  const content = (
    <>
      <span
        className={cx(
          'flex size-9 shrink-0 items-center justify-center rounded-md',
          danger ? 'text-negative bg-surface-raised' : 'bg-surface-raised',
        )}
      >
        <Icon name={icon} size={20} />
      </span>
      <span className={cx('flex-1', danger && 'text-negative font-semibold')}>{label}</span>
      {value && <span className="text-small text-text-muted">{value}</span>}
      {trailing ?? (onClick && <Icon name="chevron-right" size={20} className="text-text-muted" />)}
    </>
  )

  const className = 'flex min-h-15 w-full items-center gap-3 px-4 text-left'
  // Rows with their own control (a toggle) aren't buttons themselves: no buttons inside buttons
  return onClick && !trailing ? (
    <button type="button" onClick={onClick} className={cx(className, 'active:bg-surface-raised')}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  )
}
