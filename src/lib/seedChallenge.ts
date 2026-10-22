import { DEMO_WORDS } from '@/lib/mockCrypto'

const shuffle = <T>(items: T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Builds the "confirm your backup" quiz:
 * - `positions`: 3 random word positions (0-based, in order), e.g. [2, 6, 10] → words #3, #7, #11
 * - `options`: the 3 correct words + 3 decoys that aren't in the phrase, shuffled
 */
export function createSeedChallenge(phrase: string[], count = 3) {
  const positions = shuffle(phrase.map((_, i) => i))
    .slice(0, count)
    .sort((a, b) => a - b)
  const answers = positions.map((p) => phrase[p])
  const decoys = shuffle(DEMO_WORDS.filter((w) => !phrase.includes(w))).slice(0, count)
  return { positions, options: shuffle([...answers, ...decoys]) }
}
