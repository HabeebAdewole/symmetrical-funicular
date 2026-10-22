import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { OnboardingLayout } from '@/app/layouts/OnboardingLayout'
import { WalletLayout } from '@/app/layouts/WalletLayout'

// Turns `() => import('./SomePage')` into the shape React Router's `lazy` expects.
// Each page becomes its own small JS file that only downloads when you visit it.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    element: <OnboardingLayout />,
    children: [
      { path: '/welcome', lazy: page(() => import('@/pages/onboarding/WelcomePage')) },
      {
        path: '/onboarding',
        children: [
          { path: 'create', lazy: page(() => import('@/pages/onboarding/CreateWalletPage')) },
          { path: 'seed', lazy: page(() => import('@/pages/onboarding/ShowSeedPage')) },
          { path: 'seed/confirm', lazy: page(() => import('@/pages/onboarding/ConfirmSeedPage')) },
          { path: 'import', lazy: page(() => import('@/pages/onboarding/ImportWalletPage')) },
          { path: 'pin', lazy: page(() => import('@/pages/onboarding/SetPinPage')) },
        ],
      },
    ],
  },
  {
    element: <WalletLayout />,
    children: [
      { index: true, lazy: page(() => import('@/pages/wallet/HomePage')) },
      { path: '/asset/:coinId', lazy: page(() => import('@/pages/wallet/AssetDetailPage')) },
      { path: '/send', lazy: page(() => import('@/pages/wallet/SendPage')) },
      { path: '/receive', lazy: page(() => import('@/pages/wallet/ReceivePage')) },
      { path: '/swap', lazy: page(() => import('@/pages/wallet/SwapPage')) },
      { path: '/activity', lazy: page(() => import('@/pages/wallet/ActivityPage')) },
      { path: '/market', lazy: page(() => import('@/pages/wallet/MarketPage')) },
      { path: '/notifications', lazy: page(() => import('@/pages/wallet/NotificationsPage')) },
      { path: '/settings', lazy: page(() => import('@/pages/wallet/SettingsPage')) },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, lazy: page(() => import('@/pages/admin/AdminOverviewPage')) },
      { path: 'users', lazy: page(() => import('@/pages/admin/AdminUsersPage')) },
      { path: 'users/:userId', lazy: page(() => import('@/pages/admin/AdminUserDetailPage')) },
      { path: 'transactions', lazy: page(() => import('@/pages/admin/AdminTransactionsPage')) },
      { path: 'settings', lazy: page(() => import('@/pages/admin/AdminSettingsPage')) },
      { path: 'tickets', lazy: page(() => import('@/pages/admin/AdminTicketsPage')) },
    ],
  },
])
