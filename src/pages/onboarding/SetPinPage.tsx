import { useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { PinDots } from '@/components/ui/PinDots'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { Screen } from '@/components/ui/Screen'
import { StepProgress } from '@/components/ui/StepProgress'
import { TopBar } from '@/components/ui/TopBar'
import { usePinInput } from '@/hooks/usePinInput'
import { haptics } from '@/lib/haptics'
import { useOnboardingStore } from '@/store/onboardingStore'
import { useWalletStore } from '@/store/walletStore'

export default function SetPinPage() {
  const setPin = useWalletStore((s) => s.setPin)
  const clearDraft = useOnboardingStore((s) => s.clearDraft)
  // Two passes: create, then type it again to confirm
  const [firstPin, setFirstPin] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const pin = usePinInput(async (entered, { fail, reset }) => {
    if (firstPin === null) {
      setFirstPin(entered)
      setMessage(null)
      reset()
    } else if (entered === firstPin) {
      haptics.success()
      clearDraft()
      await setPin(entered) // status → ready + unlocked, so the route guard opens the wallet
    } else {
      setMessage('Those PINs didn’t match. Let’s start again.')
      setFirstPin(null)
      fail()
    }
  })

  const confirming = firstPin !== null

  return (
    // No back button: the phrase is already saved, so the only way forward is setting a PIN
    <Screen header={<TopBar title="Secure your wallet" />} centered>
      <StepProgress step={4} />
      <span className="bg-highlight text-on-highlight flex size-18 items-center justify-center rounded-full">
        <Icon name="lock" size={30} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">
          {confirming ? 'Confirm your PIN' : 'Create a 6-digit PIN'}
        </h1>
        <p className={message ? 'text-negative' : 'text-text-muted'} aria-live="polite">
          {message ??
            (confirming
              ? 'Type the same PIN once more.'
              : 'You’ll use it to unlock Kova on this device.')}
        </p>
      </div>
      <PinDots filled={pin.value.length} error={pin.error} />
      <div className="mt-auto w-full pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <PinKeypad onDigit={pin.add} onBackspace={pin.remove} disabled={pin.busy} />
      </div>
    </Screen>
  )
}
