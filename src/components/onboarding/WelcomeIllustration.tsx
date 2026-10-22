import type { ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'

// The Welcome carousel artwork, built from shapes (same idea as the Figma frame) instead of images,
// so it's crisp at any size, weighs nothing, and follows light/dark tokens.

function Coin({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`shadow-card text-h2 absolute flex items-center justify-center rounded-full font-bold ${className}`}
    >
      {label}
    </span>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="bg-hero-start relative isolate aspect-[350/300] w-full overflow-hidden rounded-[2rem]"
    >
      <span className="bg-hero-end absolute -top-[30%] -right-[15%] -z-10 aspect-square w-[85%] rounded-full" />
      <span className="border-highlight absolute -bottom-[25%] -left-[17%] -z-10 aspect-square w-[57%] rounded-full border-2 opacity-40" />
      {children}
    </div>
  )
}

/** Slide 1: your money, safe — floating coins around a balance card */
function Safe() {
  return (
    <Frame>
      <div className="bg-surface shadow-card absolute top-[34%] left-1/2 flex -translate-x-1/2 flex-col gap-1.5 rounded-[1.25rem] px-5 py-4">
        <span className="text-caption text-text-muted">Total balance</span>
        <span className="numeric text-h1 font-bold">$12,480.55</span>
        <span className="bg-highlight text-caption text-on-highlight w-fit rounded-full px-2 py-0.5 font-medium">
          +2.4% today
        </span>
      </div>
      <Coin label="₿" className="top-[12%] left-[10%] size-16 bg-[#F7931A] text-white" />
      <Coin label="Ξ" className="top-[19%] right-[10%] size-13 bg-[#627EEA] text-white" />
      <Coin label="◎" className="right-[11%] bottom-[12%] size-12 bg-[#14141A] text-white" />
      <Coin label="K" className="bg-highlight text-on-highlight bottom-[14%] left-[14%] size-14" />
    </Frame>
  )
}

/** Slide 2: live prices — a little chart card */
function Prices() {
  return (
    <Frame>
      <div className="bg-surface shadow-card absolute top-1/2 left-1/2 flex w-[72%] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-[1.25rem] p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <span className="text-small flex size-7 items-center justify-center rounded-full bg-[#F7931A] font-bold text-white">
              ₿
            </span>
            Bitcoin
          </span>
          <span className="text-positive text-caption font-semibold">+3.2%</span>
        </div>
        <svg viewBox="0 0 200 60" className="text-primary w-full">
          <path
            d="M0 48 L20 42 L40 46 L60 30 L80 34 L100 22 L120 28 L140 14 L160 18 L180 8 L200 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-caption text-text-muted">Live from CoinGecko</span>
      </div>
    </Frame>
  )
}

/** Slide 3: send & receive — two action bubbles */
function Move() {
  return (
    <Frame>
      <div className="absolute inset-0 flex items-center justify-center gap-6">
        {(['send', 'receive'] as const).map((icon, i) => (
          <span
            key={icon}
            className={`shadow-card flex size-24 items-center justify-center rounded-full ${
              i === 0
                ? 'bg-highlight text-on-highlight -translate-y-4'
                : 'bg-surface text-text translate-y-4'
            }`}
          >
            <Icon name={icon} size={40} />
          </span>
        ))}
      </div>
    </Frame>
  )
}

const arts = [Safe, Prices, Move]

/** Artwork for Welcome carousel slide 0, 1 or 2 */
export function WelcomeArt({ slide }: { slide: number }) {
  const Art = arts[slide] ?? Safe
  return <Art />
}
