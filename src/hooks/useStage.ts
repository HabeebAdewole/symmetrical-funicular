import { useWalletStore } from '@/store/walletStore'

/**
 * Where is the user in their journey?
 *   new       → no wallet yet
 *   needsPin  → phrase saved, PIN not set
 *   locked    → fully set up, needs PIN to enter
 *   unlocked  → inside the wallet
 */
export type Stage = 'new' | 'needsPin' | 'locked' | 'unlocked'

export const stageHome: Record<Stage, string> = {
  new: '/welcome',
  needsPin: '/onboarding/pin',
  locked: '/unlock',
  unlocked: '/',
}

export function useStage(): Stage {
  const status = useWalletStore((s) => s.status)
  const isLocked = useWalletStore((s) => s.isLocked)
  if (status === 'none') return 'new'
  if (status === 'needsPin') return 'needsPin'
  return isLocked ? 'locked' : 'unlocked'
}
