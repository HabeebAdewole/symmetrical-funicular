import { Outlet } from 'react-router'
import { PhoneFrame } from '@/app/layouts/PhoneFrame'
import { TabBar } from '@/components/ui/TabBar'

export function WalletLayout() {
  return (
    <PhoneFrame>
      {/* pb-24 leaves room so content never hides behind the fixed bottom nav */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <TabBar />
    </PhoneFrame>
  )
}
