import { Icon } from '@/components/icons/Icon'

type HeroBalanceCardProps = {
  label?: string
  /** Already formatted, e.g. "$12,480.55" */
  balance: string
  /** Already formatted, e.g. "+$291.40 · 2.4% today" */
  change?: string
  hidden?: boolean
  onToggleHidden?: () => void
}

/**
 * Kova's signature Home card: emerald with a darker glow and a lime ring.
 * It looks the same in light and dark mode (hero-* tokens don't change).
 */
export function HeroBalanceCard({
  label = 'Total balance',
  balance,
  change,
  hidden,
  onToggleHidden,
}: HeroBalanceCardProps) {
  return (
    <section className="bg-hero-start text-on-hero shadow-hero relative isolate flex flex-col gap-3 overflow-hidden rounded-xl p-6">
      {/* Decorative shapes (aria-hidden so screen readers skip them) */}
      <span
        aria-hidden="true"
        className="bg-hero-end absolute -top-15 -right-10 -z-10 size-55 rounded-full"
      />
      <span
        aria-hidden="true"
        className="border-highlight absolute top-17 -right-10 -z-10 size-35 rounded-full border-2 opacity-35"
      />

      <div className="text-small flex items-center gap-2 opacity-80">
        {label}
        {onToggleHidden && (
          <button
            type="button"
            onClick={onToggleHidden}
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
          >
            <Icon name={hidden ? 'eye-off' : 'eye'} size={18} />
          </button>
        )}
      </div>
      <p className="numeric text-display font-extrabold">{hidden ? '••••••' : balance}</p>
      {change && (
        <p className="bg-highlight text-small text-on-highlight w-fit rounded-full px-2.5 py-1 font-semibold">
          {hidden ? '••••' : change}
        </p>
      )}
    </section>
  )
}
