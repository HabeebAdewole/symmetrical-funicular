import type { ReactNode } from 'react'

// The wallet is mobile-first. On a phone it fills the screen.
// On wider screens we center it in a phone-sized column so it still looks like an app.
// pt-safe keeps content below the notch when Kova is installed and runs full screen.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-raised flex min-h-dvh justify-center">
      <div className="bg-bg sm:border-border pt-safe relative flex min-h-dvh w-full max-w-[430px] flex-col sm:border-x">
        {children}
      </div>
    </div>
  )
}
