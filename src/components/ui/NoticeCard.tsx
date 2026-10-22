import type { ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'
import { cx } from '@/lib/cx'

/** Inline safety/info message. Figma: Notice Card (Tone=Warning|Info) */
export function NoticeCard({
  tone = 'info',
  children,
}: {
  tone?: 'warning' | 'info'
  children: ReactNode
}) {
  return (
    <div
      role={tone === 'warning' ? 'alert' : 'note'}
      className={cx(
        'bg-surface text-small flex gap-3 rounded-lg border px-4 py-3.5',
        tone === 'warning' ? 'border-warning' : 'border-border',
      )}
    >
      <Icon
        name={tone === 'warning' ? 'alert' : 'shield'}
        size={20}
        className={cx('mt-px shrink-0', tone === 'warning' ? 'text-warning' : 'text-primary')}
      />
      <p>{children}</p>
    </div>
  )
}
