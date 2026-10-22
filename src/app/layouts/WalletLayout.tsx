import { NavLink, Outlet } from 'react-router'
import { PhoneFrame } from '@/app/layouts/PhoneFrame'

const tabs = [
  { to: '/', label: 'Home' },
  { to: '/market', label: 'Market' },
  { to: '/swap', label: 'Swap' },
  { to: '/activity', label: 'Activity' },
  { to: '/settings', label: 'Settings' },
]

export function WalletLayout() {
  return (
    <PhoneFrame>
      {/* pb-20 leaves room so content never hides behind the fixed bottom nav */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bare-bones bottom nav; Phase 1 restyles it with icons from the Figma design */}
      <nav
        aria-label="Main"
        className="border-border bg-surface fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t"
      >
        <ul className="flex justify-around py-3">
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'text-accent text-sm' : 'text-text-muted text-sm'
                }
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </PhoneFrame>
  )
}
