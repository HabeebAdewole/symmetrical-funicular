import { useState } from 'react'
import { haptics } from '@/lib/haptics'

export const PIN_LENGTH = 6

type PinControls = { fail: () => void; reset: () => void }

/**
 * Shared PIN-entry logic for Set PIN and Unlock.
 * Collects digits, calls `onComplete` once 6 are entered, and exposes `fail()`
 * to shake the dots, buzz, and clear for another try.
 */
export function usePinInput(
  // Receives the PIN plus fail/reset, so callers never need to reference the hook's own return value
  onComplete: (pin: string, controls: PinControls) => void | Promise<void>,
) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const add = (digit: string) => {
    if (busy || value.length >= PIN_LENGTH) return
    const next = value + digit
    setValue(next)
    setError(false)
    if (next.length === PIN_LENGTH) {
      setBusy(true)
      // Short pause so the 6th dot visibly fills before anything happens
      setTimeout(async () => {
        await onComplete(next, { fail, reset })
        setBusy(false)
      }, 150)
    }
  }

  const remove = () => {
    if (!busy) setValue((v) => v.slice(0, -1))
  }

  const reset = () => {
    setValue('')
    setError(false)
  }

  /** Wrong PIN: red dots + shake + buzz, then clear */
  const fail = () => {
    haptics.error()
    setError(true)
    setTimeout(reset, 600)
  }

  return { value, error, busy, add, remove, reset, fail }
}
