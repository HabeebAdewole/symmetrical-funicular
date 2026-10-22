import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { UpdateBanner } from '@/components/UpdateBanner'
import { useApplyTheme } from '@/hooks/useApplyTheme'
import { useConfirmationSimulator } from '@/hooks/useConfirmationSimulator'

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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <UpdateBanner />
    </QueryClientProvider>
  )
}
