import type { ReactNode } from 'react'

// The wallet is mobile-first. On a phone it fills the screen.
// On wider screens we center it in a phone-sized column so it still looks like an app.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className="bg-bg sm:border-border relative flex min-h-dvh w-full max-w-[430px] flex-col sm:border-x">
        {children}
      </div>
    </div>
  )
}
