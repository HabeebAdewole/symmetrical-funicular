// ⚠️ DEMO ONLY. Nothing in this file is real cryptography.
// Real wallets derive keys from a BIP39 seed phrase. Kova just *looks* like it does:
// - seed phrases are 12 random words from a small Kova-only word list
// - addresses are generated from a hash of the phrase (fake, but stable per wallet)
// - the PIN is hashed so it isn't sitting in localStorage as plain text, but this is not real security

import { hashString, seededRandom } from '@/lib/random'

// 256 short, unambiguous words. Deliberately NOT the BIP39 list, so a real phrase
// pasted into "Import wallet" will almost certainly be rejected.
// prettier-ignore
export const DEMO_WORDS = [
  'acorn', 'amber', 'anchor', 'apple', 'arch', 'arrow', 'aspen', 'atlas',
  'badge', 'bamboo', 'banner', 'basil', 'beacon', 'berry', 'birch', 'blaze',
  'bloom', 'bolt', 'bonsai', 'breeze', 'brick', 'brook', 'buckle', 'cabin',
  'cactus', 'canoe', 'canyon', 'cargo', 'cedar', 'cello', 'chalk', 'cherry',
  'chess', 'cider', 'cinder', 'citrus', 'clover', 'cobalt', 'comet', 'copper',
  'coral', 'cotton', 'crane', 'crater', 'crest', 'cricket', 'crystal', 'cypress',
  'dahlia', 'daisy', 'delta', 'denim', 'desert', 'dew', 'dolphin', 'domino',
  'dove', 'dragon', 'drift', 'drum', 'dune', 'eagle', 'easel', 'ember',
  'emerald', 'falcon', 'fern', 'fiddle', 'fig', 'flame', 'flint', 'fjord',
  'forest', 'fossil', 'fox', 'frost', 'galaxy', 'garnet', 'gecko', 'geyser',
  'ginger', 'glacier', 'glow', 'granite', 'grape', 'gravel', 'grove', 'gull',
  'harbor', 'hazel', 'heron', 'hickory', 'hive', 'holly', 'honey', 'horizon',
  'iceberg', 'indigo', 'iris', 'island', 'ivory', 'ivy', 'jade', 'jasmine',
  'jasper', 'jelly', 'jetty', 'juniper', 'kayak', 'kelp', 'kernel', 'kettle',
  'kite', 'koala', 'lagoon', 'lantern', 'larch', 'lava', 'lemon', 'lilac',
  'linen', 'lotus', 'lunar', 'lynx', 'magnet', 'mango', 'maple', 'marble',
  'meadow', 'melon', 'mesa', 'meteor', 'mint', 'mirror', 'mist', 'moss',
  'nectar', 'nebula', 'nickel', 'nimbus', 'nomad', 'nutmeg', 'oak', 'oasis',
  'ocean', 'olive', 'onyx', 'opal', 'orbit', 'orchid', 'otter', 'oyster',
  'paddle', 'panda', 'papaya', 'pebble', 'pepper', 'petal', 'pine', 'pixel',
  'plume', 'polar', 'poppy', 'prairie', 'prism', 'puffin', 'quail', 'quartz',
  'quill', 'quince', 'rapids', 'raven', 'reef', 'ribbon', 'ridge', 'ripple',
  'robin', 'rocket', 'rose', 'ruby', 'saffron', 'sage', 'salmon', 'sandal',
  'sapphire', 'satin', 'savanna', 'scarlet', 'sequoia', 'shell', 'sierra', 'silk',
  'slate', 'sorrel', 'sparrow', 'spruce', 'squid', 'starling', 'stone', 'summit',
  'sunset', 'swan', 'tango', 'thistle', 'thunder', 'tide', 'tiger', 'timber',
  'topaz', 'torch', 'tulip', 'tundra', 'turtle', 'twig', 'umber', 'valley',
  'vanilla', 'velvet', 'violet', 'volcano', 'wafer', 'walnut', 'walrus', 'wander',
  'wave', 'willow', 'window', 'winter', 'wisp', 'wren', 'yarrow', 'yeti',
  'yonder', 'zebra', 'zenith', 'zephyr', 'zinc', 'zircon', 'badger', 'beetle',
  'bison', 'cobra', 'condor', 'cougar', 'ferret', 'finch', 'hawk', 'ibis',
  'jackal', 'lemur', 'magpie', 'marten', 'moose', 'osprey', 'pelican', 'pigeon',
]

/**
 * 12 random, all-different words. Uses the browser's secure RNG (overkill for a demo, but the right habit).
 * Real BIP39 phrases can repeat a word; we avoid repeats so the "confirm your backup" quiz is never ambiguous.
 */
export function generateSeedPhrase(wordCount: 12 | 24 = 12): string[] {
  const chosen = new Set<string>()
  while (chosen.size < wordCount) {
    const [index] = crypto.getRandomValues(new Uint8Array(1))
    chosen.add(DEMO_WORDS[index]) // a Set ignores duplicates, so we just draw again
  }
  return [...chosen]
}

export type SeedValidation = { ok: true; words: string[] } | { ok: false; error: string }

/** Validates a phrase typed or pasted into "Import wallet". */
export function validateSeedPhrase(input: string): SeedValidation {
  const words = input.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length !== 12 && words.length !== 24) {
    return {
      ok: false,
      error: `Recovery phrases have 12 or 24 words. You entered ${words.length}.`,
    }
  }
  const unknown = words.filter((word) => !DEMO_WORDS.includes(word))
  if (unknown.length > 0) {
    return { ok: false, error: `Not in the Kova demo word list: ${unknown.slice(0, 3).join(', ')}` }
  }
  return { ok: true, words }
}

export type Network = 'ethereum' | 'bitcoin' | 'solana'

const HEX = '0123456789abcdef'
const BECH32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function randomString(rand: () => number, alphabet: string, length: number) {
  let out = ''
  for (let i = 0; i < length; i++) out += alphabet[Math.floor(rand() * alphabet.length)]
  return out
}

/** A fake but realistically formatted address. Same phrase + network → same address every time. */
export function deriveMockAddress(seedPhrase: string[], network: Network) {
  const rand = seededRandom(hashString(seedPhrase.join(' ') + network))
  switch (network) {
    case 'ethereum':
      return '0x' + randomString(rand, HEX, 40)
    case 'bitcoin':
      return 'bc1q' + randomString(rand, BECH32, 38)
    case 'solana':
      return randomString(rand, BASE58, 44)
  }
}

/** Which address a coin is received on */
export const COIN_NETWORK: Record<string, Network> = {
  bitcoin: 'bitcoin',
  solana: 'solana',
  // Everything else is treated as an Ethereum-style (EVM) token for the demo
}
export const networkForCoin = (coinId: string): Network => COIN_NETWORK[coinId] ?? 'ethereum'

/** SHA-256 of the PIN with a fixed salt, as hex. Async because Web Crypto is async. */
export async function hashPin(pin: string) {
  const bytes = new TextEncoder().encode(`kova-demo:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}
