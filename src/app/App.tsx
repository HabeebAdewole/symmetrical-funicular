import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { UpdateBanner } from '@/components/UpdateBanner'
import { useApplyTheme } from '@/hooks/useApplyTheme'
import { useAutoLock } from '@/hooks/useAutoLock'
import { useConfirmationSimulator } from '@/hooks/useConfirmationSimulator'
import { hideSplash } from '@/lib/splash'

// One shared cache for all server data (CoinGecko prices etc.)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prices are "fresh" for 60s, which keeps us well under CoinGecko's free rate limit
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  useApplyTheme()
  // Pending sends "confirm" after ~20s (does nothing when there's no wallet or nothing pending)
  useConfirmationSimulator()
  // Settings → Auto-lock: ask for the PIN again after time away
  useAutoLock()

  // Fade the splash out once the router has loaded the first real screen (not the loading spinner)
  useEffect(() => {
    if (router.state.initialized) return hideSplash()
    return router.subscribe((state) => {
      if (state.initialized) hideSplash()
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <UpdateBanner />
    </QueryClientProvider>
  )
}
