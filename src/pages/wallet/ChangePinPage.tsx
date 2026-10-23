import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { PinDots } from '@/components/ui/PinDots'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { Screen } from '@/components/ui/Screen'
import { TopBar } from '@/components/ui/TopBar'
import { usePinInput } from '@/hooks/usePinInput'
import { haptics } from '@/lib/haptics'
import { useWalletStore } from '@/store/walletStore'

type Step = 'current' | 'new' | 'confirm' | 'done'

const copy: Record<Exclude<Step, 'done'>, { title: string; hint: string }> = {
  current: { title: 'Enter your current PIN', hint: 'To make sure it’s really you.' },
  new: { title: 'Choose a new PIN', hint: 'Six digits you’ll remember, but others won’t guess.' },
  confirm: { title: 'Confirm your new PIN', hint: 'Type the new PIN once more.' },
}

/** Settings → Change PIN: current PIN → new PIN → confirm. */
export default function ChangePinPage() {
  const navigate = useNavigate()
  const verifyPin = useWalletStore((s) => s.verifyPin)
  const setPin = useWalletStore((s) => s.setPin)
  const [step, setStep] = useState<Step>('current')
  const [newPin, setNewPin] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const pin = usePinInput(async (entered, { fail, reset }) => {
    if (step === 'current') {
      if (await verifyPin(entered)) {
        setStep('new')
        setMessage(null)
        reset()
      } else {
        setMessage('That’s not your current PIN.')
        fail()
      }
    } else if (step === 'new') {
      if (await verifyPin(entered)) {
        setMessage('That’s the same as your current PIN. Pick a different one.')
        fail()
        return
      }
      setNewPin(entered)
      setStep('confirm')
      setMessage(null)
      reset()
    } else if (step === 'confirm') {
      if (entered === newPin) {
        await setPin(entered)
        haptics.success()
        setStep('done')
      } else {
        setMessage('Those didn’t match. Choose your new PIN again.')
        setStep('new')
        fail()
      }
    }
  })

  if (step === 'done') {
    return (
      <Screen
        centered
        className="justify-center"
        footer={<Button onClick={() => navigate('/settings')}>Done</Button>}
      >
        <span className="bg-highlight text-on-highlight animate-pop-in flex size-20 items-center justify-center rounded-full">
          <Icon name="check" size={40} />
        </span>
        <h1 className="text-h1 font-bold">PIN changed</h1>
        <p className="text-text-muted">Use your new PIN next time you unlock Kova.</p>
      </Screen>
    )
  }

  return (
    <Screen header={<TopBar title="Change PIN" onBack={() => navigate(-1)} />} centered>
      <span className="bg-surface-raised flex size-16 items-center justify-center rounded-full">
        <Icon name="lock" size={28} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">{copy[step].title}</h1>
        <p aria-live="polite" className={message ? 'text-negative' : 'text-text-muted'}>
          {message ?? copy[step].hint}
        </p>
      </div>
      <PinDots filled={pin.value.length} error={pin.error} />
      <div className="mt-auto w-full pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <PinKeypad onDigit={pin.add} onBackspace={pin.remove} disabled={pin.busy} />
      </div>
    </Screen>
  )
}
