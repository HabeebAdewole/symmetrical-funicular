// A tiny *seeded* random number generator (mulberry32).
// Same seed → same sequence every time, so mock data looks identical on every reload.
// NOT for anything security-related. Real wallets use crypto.getRandomValues.
export function seededRandom(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Turns a string like "bitcoin" into a stable number seed */
export function hashString(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * A believable random-walk price series ending at `endPrice`.
 * `volatility` is the typical per-step move (0.01 = 1%).
 */
export function randomWalk(seed: number, points: number, endPrice: number, volatility: number) {
  const rand = seededRandom(seed)
  const series = [1]
  for (let i = 1; i < points; i++) {
    const step = (rand() - 0.5) * 2 * volatility
    series.push(series[i - 1] * (1 + step))
  }
  // Scale so the last point is exactly the current price
  const scale = endPrice / series[series.length - 1]
  return series.map((value) => value * scale)
}
