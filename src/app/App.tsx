import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { useApplyTheme } from '@/hooks/useApplyTheme'

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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
