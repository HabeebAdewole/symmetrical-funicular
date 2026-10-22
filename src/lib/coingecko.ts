// Thin, typed wrapper around the free CoinGecko API.
// Docs: https://docs.coingecko.com/v3.0.1/reference/introduction
// Only market data is fetched here. Wallet balances are mocked (see src/mocks/wallet.ts).

import type { FiatCurrency } from '@/lib/format'

const BASE_URL = 'https://api.coingecko.com/api/v3'

// Optional free "demo" key raises the rate limit. Put it in .env.local (never commit it):
// VITE_COINGECKO_API_KEY=CG-xxxxxxxx
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY as string | undefined

/** Coins Kova "supports". Order = default display order. */
export const SUPPORTED_COIN_IDS = [
  'bitcoin',
  'ethereum',
  'solana',
  'tether',
  'usd-coin',
  'binancecoin',
  'ripple',
  'cardano',
  'dogecoin',
  'avalanche-2',
  'chainlink',
  'polkadot',
] as const

export type CoinId = (typeof SUPPORTED_COIN_IDS)[number]

/** One row from /coins/markets (only the fields we use) */
export type MarketCoin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_percentage_24h: number
  circulating_supply: number
  sparkline_in_7d?: { price: number[] }
}

/** [timestamp in ms, price] */
export type PricePoint = [number, number]

export type ChartRange = '1' | '7' | '30' | '365'

export class CoinGeckoError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL + path)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)

  const response = await fetch(url, {
    headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : undefined,
  })

  if (!response.ok) {
    // 429 = rate limited. The hooks catch this and switch to mock data.
    throw new CoinGeckoError(response.status, `CoinGecko ${path} failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export function fetchMarkets(currency: FiatCurrency, ids: readonly string[] = SUPPORTED_COIN_IDS) {
  return request<MarketCoin[]>('/coins/markets', {
    vs_currency: currency,
    ids: ids.join(','),
    order: 'market_cap_desc',
    sparkline: 'true',
    price_change_percentage: '24h',
  })
}

/** Whole-market totals for the Market screen's stat cards */
export type GlobalMarket = {
  totalMarketCap: number
  totalVolume: number
  marketCapChange24h: number
  volumeChange24h: number
}

export async function fetchGlobal(currency: FiatCurrency): Promise<GlobalMarket> {
  const { data } = await request<{
    data: {
      total_market_cap: Record<string, number>
      total_volume: Record<string, number>
      market_cap_change_percentage_24h_usd: number
      volume_change_percentage_24h_usd: number
    }
  }>('/global', {})
  return {
    totalMarketCap: data.total_market_cap[currency],
    totalVolume: data.total_volume[currency],
    marketCapChange24h: data.market_cap_change_percentage_24h_usd,
    volumeChange24h: data.volume_change_percentage_24h_usd,
  }
}

export async function fetchCoinChart(id: string, currency: FiatCurrency, days: ChartRange) {
  const data = await request<{ prices: PricePoint[] }>(`/coins/${id}/market_chart`, {
    vs_currency: currency,
    days,
  })
  return data.prices
}
