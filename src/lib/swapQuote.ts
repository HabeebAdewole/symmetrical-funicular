// How much you get when swapping one coin for another, in Kova's pretend exchange.
// A pure function: numbers in, numbers out, no React. Easy to read and easy to test.

/** Kova's cut of every swap (matches the seeded history in src/mocks/wallet.ts) */
export const KOVA_FEE_RATE = 0.003

export type SwapQuote = {
  /** How many to-coins one from-coin buys, before fees */
  rate: number
  /** What you're paying, in USD */
  valueUsd: number
  kovaFeeUsd: number
  networkFeeUsd: number
  /** What lands in your wallet, in the to-coin, after fees (never negative) */
  toAmount: number
}

/**
 * @param fromAmount   how much of the from-coin you're paying
 * @param fromPriceUsd price of 1 from-coin in USD
 * @param toPriceUsd   price of 1 to-coin in USD
 * @param networkFeeUsd network fee for the from-coin's chain
 */
export function quoteSwap(
  fromAmount: number,
  fromPriceUsd: number,
  toPriceUsd: number,
  networkFeeUsd: number,
): SwapQuote {
  const rate = toPriceUsd > 0 ? fromPriceUsd / toPriceUsd : 0
  const valueUsd = fromAmount * fromPriceUsd
  const kovaFeeUsd = valueUsd * KOVA_FEE_RATE
  const fees = fromAmount > 0 ? networkFeeUsd : 0
  const receiveUsd = Math.max(0, valueUsd - kovaFeeUsd - fees)
  return {
    rate,
    valueUsd,
    kovaFeeUsd,
    networkFeeUsd: fees,
    toAmount: toPriceUsd > 0 ? receiveUsd / toPriceUsd : 0,
  }
}
