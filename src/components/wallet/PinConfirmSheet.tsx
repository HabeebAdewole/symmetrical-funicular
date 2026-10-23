import { useState } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { PinDots } from '@/components/ui/PinDots'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { usePinInput } from '@/hooks/usePinInput'
import { useWalletStore } from '@/store/walletStore'

type PinConfirmSheetProps = {
  open: boolean
  onClose: () => void
  /** Called once the right PIN is entered */
  onConfirmed: () => void
  title?: string
  /** Shown above the keypad, e.g. a warning about what confirming will do */
  message?: string
}

function PinConfirmBody({ onConfirmed, message }: { onConfirmed: () => void; message?: string }) {
  const verifyPin = useWalletStore((s) => s.verifyPin)
  const [wrong, setWrong] = useState(false)

  const pin = usePinInput(async (entered, { fail }) => {
    if (await verifyPin(entered)) {
      onConfirmed()
    } else {
      setWrong(true)
      fail()
    }
  })

  return (
    <div className="flex flex-col items-center gap-6">
      <p aria-live="polite" className={wrong ? 'text-negative' : 'text-text-muted'}>
        {wrong ? 'Wrong PIN. Try again.' : (message ?? 'Enter your PIN to approve this.')}
      </p>
      <PinDots filled={pin.value.length} error={pin.error} />
      <PinKeypad onDigit={pin.add} onBackspace={pin.remove} disabled={pin.busy} compact />
    </div>
  )
}

/** "Enter PIN to confirm" bottom sheet, like a real wallet asks before moving money. */
export function PinConfirmSheet({
  open,
  onClose,
  onConfirmed,
  title = 'Confirm with PIN',
  message,
}: PinConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      {/* Only mounted while open, so every opening starts with an empty PIN */}
      {open && <PinConfirmBody onConfirmed={onConfirmed} message={message} />}
    </BottomSheet>
  )
}
