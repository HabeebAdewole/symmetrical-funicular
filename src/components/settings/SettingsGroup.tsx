import type { ReactNode } from 'react'

/** A titled card of settings rows with thin dividers between them. */
export function SettingsGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      {title && <h2 className="text-caption text-text-muted px-1">{title}</h2>}
      <div className="bg-surface divide-border flex flex-col divide-y overflow-hidden rounded-lg">
        {children}
      </div>
    </section>
  )
}
