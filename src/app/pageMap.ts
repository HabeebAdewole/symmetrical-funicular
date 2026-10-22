// Every page in the app, grouped by who uses it.
// The placeholder pages use this to render a clickable app map during development.
export const pageMap = [
  {
    group: 'Onboarding',
    pages: [
      { path: '/welcome', title: 'Welcome' },
      { path: '/onboarding/create', title: 'Create wallet' },
      { path: '/onboarding/seed', title: 'Show seed phrase' },
      { path: '/onboarding/seed/confirm', title: 'Confirm seed phrase' },
      { path: '/onboarding/import', title: 'Import wallet' },
      { path: '/onboarding/pin', title: 'Set PIN' },
    ],
  },
  {
    group: 'Wallet',
    pages: [
      { path: '/', title: 'Home' },
      { path: '/asset/bitcoin', title: 'Asset detail' },
      { path: '/send', title: 'Send' },
      { path: '/receive', title: 'Receive' },
      { path: '/swap', title: 'Swap' },
      { path: '/activity', title: 'Transaction history' },
      { path: '/market', title: 'Market & explore' },
      { path: '/notifications', title: 'Notifications' },
      { path: '/settings', title: 'Settings' },
    ],
  },
  {
    group: 'Admin',
    pages: [
      { path: '/admin', title: 'Overview' },
      { path: '/admin/users', title: 'Users' },
      { path: '/admin/users/usr_001', title: 'User detail & KYC' },
      { path: '/admin/transactions', title: 'Transaction monitoring' },
      { path: '/admin/settings', title: 'Fees & assets' },
      { path: '/admin/tickets', title: 'Support tickets' },
    ],
  },
] as const
