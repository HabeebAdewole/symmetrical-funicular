import { NavLink } from 'react-router'
import { Icon, type IconName } from '@/components/icons/Icon'
import { cx } from '@/lib/cx'

const tabs: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/market', label: 'Market', icon: 'market' },
  { to: '/swap', label: 'Swap', icon: 'swap' },
  { to: '/activity', label: 'Activity', icon: 'activity' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

/** Wallet bottom navigation (Figma: Tab Bar). Fixed to the bottom of the phone column. */
export function TabBar() {
  return (
    <nav
      aria-label="Main"
      className="border-border bg-surface fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <ul className="flex justify-around px-4 pt-2">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                cx(
                  'text-caption flex w-16 flex-col items-center gap-1 font-medium',
                  isActive ? 'text-primary' : 'text-text-muted',
                )
              }
            >
              <Icon name={tab.icon} />
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
