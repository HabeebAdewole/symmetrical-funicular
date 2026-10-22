import { Outlet } from 'react-router'
import { PhoneFrame } from '@/app/layouts/PhoneFrame'

export function OnboardingLayout() {
  return (
    <PhoneFrame>
      <main className="flex-1">
        <Outlet />
      </main>
    </PhoneFrame>
  )
}
