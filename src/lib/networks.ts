// Per-network rules for the demo: what a valid address looks like and what a send "costs".
// Real wallets estimate fees live from the network; fixed USD amounts are fine for a mock.

import { networkForCoin, type Network } from '@/lib/mockCrypto'

type NetworkInfo = {
  name: string
  /** Shown under the address field */
  addressHint: string
  /** Network fee in USD (converted into the coin being sent) */
  feeUsd: number
  /** Rough time until "confirmed" */
  eta: string
  isValidAddress: (address: string) => boolean
}

export const NETWORKS: Record<Network, NetworkInfo> = {
  bitcoin: {
    name: 'Bitcoin',
    addressHint: 'Bitcoin address starting with bc1, 1 or 3',
    feeUsd: 1.48,
    eta: '~10 minutes',
    // bech32 (bc1…) or legacy (1… / 3…) formats
    isValidAddress: (a) =>
      /^bc1[02-9ac-hj-np-z]{25,62}$/.test(a) || /^[13][1-9A-HJ-NP-Za-km-z]{25,34}$/.test(a),
  },
  ethereum: {
    name: 'Ethereum',
    addressHint: 'Ethereum address starting with 0x',
    feeUsd: 0.85,
    eta: '~30 seconds',
    isValidAddress: (a) => /^0x[0-9a-fA-F]{40}$/.test(a),
  },
  solana: {
    name: 'Solana',
    addressHint: 'Solana address (32–44 letters and numbers)',
    feeUsd: 0.01,
    eta: '~5 seconds',
    // base58: no 0, O, I or l
    isValidAddress: (a) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a),
  },
}

export const networkOf = (coinId: string) => NETWORKS[networkForCoin(coinId)]

/** Network fee for sending this coin, in the coin itself (e.g. 0.000018 BTC) */
export const feeInCoin = (coinId: string, usdPrice: number) =>
  usdPrice > 0 ? networkOf(coinId).feeUsd / usdPrice : 0
