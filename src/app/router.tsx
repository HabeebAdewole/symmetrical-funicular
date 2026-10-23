import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { Gate } from '@/app/Gate'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { StackLayout } from '@/app/layouts/StackLayout'
import { WalletLayout } from '@/app/layouts/WalletLayout'
import { AppLoading } from '@/components/AppLoading'

// Turns `() => import('./SomePage')` into the shape React Router's `lazy` expects.
// Each page becomes its own small JS file that only downloads when you visit it.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    // Root route: shown while the first page's code downloads
    HydrateFallback: AppLoading,
    children: [
      // Living style guide (all design-system components, both themes)
      { path: '/ui', lazy: page(() => import('@/pages/dev/StyleGuidePage')) },
      {
        element: <StackLayout />,
        children: [
          {
            // Only for people without a wallet
            element: <Gate allow="new" />,
            children: [
              { path: '/welcome', lazy: page(() => import('@/pages/onboarding/WelcomePage')) },
              {
                path: '/onboarding/create',
                lazy: page(() => import('@/pages/onboarding/CreateWalletPage')),
              },
              {
                path: '/onboarding/seed',
                lazy: page(() => import('@/pages/onboarding/ShowSeedPage')),
              },
              {
                path: '/onboarding/seed/confirm',
                lazy: page(() => import('@/pages/onboarding/ConfirmSeedPage')),
              },
              {
                path: '/onboarding/import',
                lazy: page(() => import('@/pages/onboarding/ImportWalletPage')),
              },
            ],
          },
          {
            element: <Gate allow="needsPin" />,
            children: [
              {
                path: '/onboarding/pin',
                lazy: page(() => import('@/pages/onboarding/SetPinPage')),
              },
            ],
          },
          {
            element: <Gate allow="locked" />,
            children: [
              { path: '/unlock', lazy: page(() => import('@/pages/onboarding/UnlockPage')) },
            ],
          },
        ],
      },
      {
        // The wallet itself: only when set up and unlocked
        element: <Gate allow="unlocked" />,
        children: [
          {
            element: <WalletLayout />,
            children: [
              { index: true, lazy: page(() => import('@/pages/wallet/HomePage')) },
              {
                path: '/asset/:coinId',
                lazy: page(() => import('@/pages/wallet/AssetDetailPage')),
              },
              { path: '/swap', lazy: page(() => import('@/pages/wallet/SwapPage')) },
              { path: '/activity', lazy: page(() => import('@/pages/wallet/ActivityPage')) },
              { path: '/market', lazy: page(() => import('@/pages/wallet/MarketPage')) },
              {
                path: '/notifications',
                lazy: page(() => import('@/pages/wallet/NotificationsPage')),
              },
              { path: '/settings', lazy: page(() => import('@/pages/wallet/SettingsPage')) },
            ],
          },
          {
            // Full-screen flows inside the wallet: no tab bar, slide-in like onboarding
            element: <StackLayout />,
            children: [
              { path: '/send', lazy: page(() => import('@/pages/wallet/SendPage')) },
              { path: '/receive', lazy: page(() => import('@/pages/wallet/ReceivePage')) },
              {
                path: '/settings/pin',
                lazy: page(() => import('@/pages/wallet/ChangePinPage')),
              },
              {
                path: '/settings/recovery-phrase',
                lazy: page(() => import('@/pages/wallet/RecoveryPhrasePage')),
              },
            ],
          },
        ],
      },
      {
        // Back office: separate audience, never guarded by the wallet
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
    ],
  },
])
