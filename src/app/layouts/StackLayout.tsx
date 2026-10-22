import { Outlet, useLocation } from 'react-router'
import { PhoneFrame } from '@/app/layouts/PhoneFrame'

// Full-screen screens with no tab bar (onboarding, Send, Receive). Each new screen slides in.
export function StackLayout() {
  const { pathname } = useLocation()

  return (
    <PhoneFrame>
      {/* key={pathname} remounts the wrapper on every route change, which replays the slide-in animation */}
      <main key={pathname} className="animate-screen-in flex flex-1 flex-col">
        <Outlet />
      </main>
    </PhoneFrame>
  )
}
