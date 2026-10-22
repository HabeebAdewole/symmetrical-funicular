import { cx } from '@/lib/cx'

/** Grey pulsing placeholder shown while data loads, so the layout doesn't jump when it arrives. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx('bg-surface-raised block animate-pulse rounded-md', className)}
    />
  )
}
