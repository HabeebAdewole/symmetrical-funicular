import { useEffect, useState } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { KovaLogo } from '@/components/ui/KovaLogo'
import { PinDots } from '@/components/ui/PinDots'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { Screen } from '@/components/ui/Screen'
import { usePinInput } from '@/hooks/usePinInput'
import { haptics } from '@/lib/haptics'
import { useWalletStore } from '@/store/walletStore'

const MAX_ATTEMPTS = 5
const COOLDOWN_SECONDS = 30

export default function UnlockPage() {
  const unlock = useWalletStore((s) => s.unlock)
  const reset = useWalletStore((s) => s.reset)
  const [failures, setFailures] = useState(0)
  const [cooldown, setCooldown] = useState(0) // seconds left
  const [sheetOpen, setSheetOpen] = useState(false)

  // Tick the cooldown down once a second
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const pin = usePinInput(async (entered, { fail }) => {
    if (await unlock(entered)) {
      haptics.success() // isLocked → false, so the route guard opens the wallet
      return
    }
    fail()
    const total = failures + 1
    if (total >= MAX_ATTEMPTS) {
      setFailures(0)
      setCooldown(COOLDOWN_SECONDS)
    } else {
      setFailures(total)
    }
  })

  const left = MAX_ATTEMPTS - failures
  const status =
    cooldown > 0
      ? `Too many attempts. Try again in ${cooldown}s.`
      : failures > 0
        ? `Wrong PIN. ${left} ${left === 1 ? 'try' : 'tries'} left.`
        : 'Enter your PIN to unlock your wallet.'

  return (
    <Screen
      centered
      className="pt-12"
      footer={
        <Button variant="ghost" onClick={() => setSheetOpen(true)}>
          Forgot PIN? Reset this wallet
        </Button>
      }
    >
      <KovaLogo />
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Welcome back</h1>
        <p
          aria-live="polite"
          className={failures > 0 || cooldown > 0 ? 'text-negative' : 'text-text-muted'}
        >
          {status}
        </p>
      </div>
      <PinDots filled={pin.value.length} error={pin.error} />
      <div className="mt-auto w-full">
        <PinKeypad onDigit={pin.add} onBackspace={pin.remove} disabled={pin.busy || cooldown > 0} />
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Reset this wallet?">
        <p className="text-text-muted">
          This removes the wallet from this device. You’ll need your 12-word recovery phrase to get
          it back.
        </p>
        <Button variant="danger" onClick={reset}>
          Reset wallet
        </Button>
        <Button variant="secondary" onClick={() => setSheetOpen(false)}>
          Cancel
        </Button>
      </BottomSheet>
    </Screen>
  )
}
