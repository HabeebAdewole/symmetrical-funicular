import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type ScreenProps = {
  /** Usually a <TopBar /> */
  header?: ReactNode
  /** Pinned to the bottom: buttons, hints */
  footer?: ReactNode
  /** Centre the body content horizontally (PIN screens) */
  centered?: boolean
  className?: string
  children: ReactNode
}

/**
 * Standard full-height mobile screen: header, a body that fills the space, and a footer
 * kept above the home bar. Mirrors the Figma frames (Body padding 20, Footer padding 20).
 */
export function Screen({ header, footer, centered, className, children }: ScreenProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {header}
      <div
        className={cx(
          'flex flex-1 flex-col gap-6 px-5 pt-2',
          centered && 'items-center text-center',
          className,
        )}
      >
        {children}
      </div>
      {footer && (
        <div className="flex flex-col gap-3 px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
          {footer}
        </div>
      )}
    </div>
  )
}
