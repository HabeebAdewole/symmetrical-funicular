// Fallback market data, used when CoinGecko is unreachable or rate-limited (HTTP 429).
// Snapshot of real USD prices from 2026-10-22, with generated 7-day sparklines.

import type { ChartRange, MarketCoin, PricePoint } from '@/lib/coingecko'
import type { FiatCurrency } from '@/lib/format'
import { hashString, randomWalk } from '@/lib/random'

const icon = (path: string) => `https://coin-images.coingecko.com/coins/images/${path}`

// Rough conversion rates so the fallback still works in other currencies
const USD_TO: Record<FiatCurrency, number> = { usd: 1, eur: 0.92, gbp: 0.78, ngn: 1550 }

const snapshot: Omit<MarketCoin, 'sparkline_in_7d'>[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: icon('1/large/bitcoin.png'),
    current_price: 82241,
    market_cap: 1653185124190,
    market_cap_rank: 1,
    total_volume: 37368638124,
    high_24h: 84808,
    low_24h: 82410,
    price_change_percentage_24h: -0.99,
    circulating_supply: 20101715,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: icon('279/large/ethereum.png'),
    current_price: 2429.23,
    market_cap: 296736562169,
    market_cap_rank: 2,
    total_volume: 14110037754,
    high_24h: 2518.86,
    low_24h: 2428.06,
    price_change_percentage_24h: -0.9,
    circulating_supply: 122152451,
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image: icon('325/large/Tether.png'),
    current_price: 0.99922,
    market_cap: 182688558652,
    market_cap_rank: 3,
    total_volume: 60249492212,
    high_24h: 0.9995,
    low_24h: 0.9989,
    price_change_percentage_24h: 0.01,
    circulating_supply: 182831230623,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: icon('825/large/bnb-icon2_2x.png'),
    current_price: 736.57,
    market_cap: 96867802959,
    market_cap_rank: 4,
    total_volume: 819091807,
    high_24h: 750.97,
    low_24h: 737.35,
    price_change_percentage_24h: -1.22,
    circulating_supply: 131511936,
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: icon('44/large/xrp-symbol-white-128.png'),
    current_price: 1.34,
    market_cap: 84550554676,
    market_cap_rank: 5,
    total_volume: 2012341190,
    high_24h: 1.4,
    low_24h: 1.34,
    price_change_percentage_24h: -0.19,
    circulating_supply: 63129671205,
  },
  {
    id: 'usd-coin',
    symbol: 'usdc',
    name: 'USDC',
    image: icon('6319/large/USDC.png'),
    current_price: 0.99966,
    market_cap: 72508246149,
    market_cap_rank: 6,
    total_volume: 14740509556,
    high_24h: 0.9999,
    low_24h: 0.9993,
    price_change_percentage_24h: 0.02,
    circulating_supply: 72532752820,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: icon('4128/large/solana.png'),
    current_price: 104.35,
    market_cap: 61524687830,
    market_cap_rank: 7,
    total_volume: 2857247295,
    high_24h: 109.08,
    low_24h: 104.42,
    price_change_percentage_24h: -2.19,
    circulating_supply: 589604551,
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: icon('5/large/dogecoin.png'),
    current_price: 0.079629,
    market_cap: 12454747754,
    market_cap_rank: 12,
    total_volume: 577352163,
    high_24h: 0.083711,
    low_24h: 0.079566,
    price_change_percentage_24h: -2.92,
    circulating_supply: 156409352864,
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: icon('877/large/Chainlink_Logo_500.png'),
    current_price: 12.18,
    market_cap: 9342067208,
    market_cap_rank: 16,
    total_volume: 268928396,
    high_24h: 12.8,
    low_24h: 12.16,
    price_change_percentage_24h: -1.81,
    circulating_supply: 766849970,
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: icon('975/large/cardano.png'),
    current_price: 0.217247,
    market_cap: 8160982842,
    market_cap_rank: 18,
    total_volume: 300055473,
    high_24h: 0.230254,
    low_24h: 0.217444,
    price_change_percentage_24h: -3.4,
    circulating_supply: 37565404869,
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: icon('12559/large/Avalanche_Circle_RedWhite_Trans.png'),
    current_price: 9.31,
    market_cap: 4133466539,
    market_cap_rank: 28,
    total_volume: 323837958,
    high_24h: 10.04,
    low_24h: 9.32,
    price_change_percentage_24h: -4.41,
    circulating_supply: 443894257,
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: icon('12171/large/polkadot.jpg'),
    current_price: 1.11,
    market_cap: 1897660813,
    market_cap_rank: 53,
    total_volume: 125440936,
    high_24h: 1.19,
    low_24h: 1.11,
    price_change_percentage_24h: -4.5,
    circulating_supply: 1708506443,
  },
]

const isStablecoin = (id: string) => id === 'tether' || id === 'usd-coin'

export function getMockMarkets(currency: FiatCurrency): MarketCoin[] {
  const rate = USD_TO[currency]
  return snapshot.map((coin) => {
    const price = coin.current_price * rate
    return {
      ...coin,
      current_price: price,
      market_cap: coin.market_cap * rate,
      total_volume: coin.total_volume * rate,
      high_24h: coin.high_24h * rate,
      low_24h: coin.low_24h * rate,
      // 168 hourly points = 7 days, like the real API
      sparkline_in_7d: {
        price: randomWalk(hashString(coin.id), 168, price, isStablecoin(coin.id) ? 0.0005 : 0.008),
      },
    }
  })
}

const POINTS_PER_RANGE: Record<ChartRange, { points: number; stepMs: number }> = {
  '1': { points: 288, stepMs: 5 * 60_000 }, // every 5 min
  '7': { points: 168, stepMs: 60 * 60_000 }, // hourly
  '30': { points: 180, stepMs: 4 * 60 * 60_000 }, // every 4 h
  '365': { points: 365, stepMs: 24 * 60 * 60_000 }, // daily
}

export function getMockChart(id: string, currency: FiatCurrency, days: ChartRange): PricePoint[] {
  const coin = getMockMarkets(currency).find((c) => c.id === id)
  const endPrice = coin?.current_price ?? 1
  const { points, stepMs } = POINTS_PER_RANGE[days]
  const volatility = isStablecoin(id) ? 0.0005 : days === '365' ? 0.03 : 0.006
  const prices = randomWalk(hashString(id + days), points, endPrice, volatility)
  const now = Date.now()
  return prices.map((price, i) => [now - (points - 1 - i) * stepMs, price])
}
