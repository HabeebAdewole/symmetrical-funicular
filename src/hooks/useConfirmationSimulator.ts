import { useEffect } from 'react'
import { useWalletStore } from '@/store/walletStore'

const CONFIRM_AFTER_MS = 20_000
const CHECK_EVERY_MS = 5_000

/**
 * Pretend blockchain: a pending transaction "confirms" about 20 seconds after it was sent.
 * Runs while the wallet is open (mounted once in the wallet layouts).
 */
export function useConfirmationSimulator() {
  const confirmPending = useWalletStore((s) => s.confirmPending)

  useEffect(() => {
    confirmPending(CONFIRM_AFTER_MS) // catch up straight away, e.g. after reopening the app
    const timer = setInterval(() => confirmPending(CONFIRM_AFTER_MS), CHECK_EVERY_MS)
    return () => clearInterval(timer)
  }, [confirmPending])
}
