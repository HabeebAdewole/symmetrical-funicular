import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/transactions', label: 'Transactions' },
  { to: '/admin/settings', label: 'Fees & assets' },
  { to: '/admin/tickets', label: 'Support' },
]

// The admin back office is desktop-first: a sidebar plus a wide content area.
export function AdminLayout() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="border-border bg-surface border-b md:w-60 md:border-r md:border-b-0">
        <p className="px-6 py-5 text-lg font-semibold">
          Kova <span className="text-text-muted">Admin</span>
        </p>
        <nav aria-label="Admin">
          <ul className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/admin'}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm whitespace-nowrap ${
                      isActive ? 'bg-surface-raised text-accent' : 'text-text-muted hover:text-text'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
