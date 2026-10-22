import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { SeedWord } from '@/components/ui/SeedWord'
import { StepProgress } from '@/components/ui/StepProgress'
import { TopBar } from '@/components/ui/TopBar'
import { cx } from '@/lib/cx'
import { haptics } from '@/lib/haptics'
import { createSeedChallenge } from '@/lib/seedChallenge'
import { useOnboardingStore } from '@/store/onboardingStore'
import { useWalletStore } from '@/store/walletStore'

export default function ConfirmSeedPage() {
  const navigate = useNavigate()
  const phrase = useOnboardingStore((s) => s.draftPhrase)
  const createWallet = useWalletStore((s) => s.createWallet)

  // useState(() => …) runs the function once, so the quiz doesn't reshuffle on every render
  const [challenge] = useState(() => (phrase ? createSeedChallenge(phrase) : null))
  const [picked, setPicked] = useState<string[]>([])
  // Which slot is shaking, plus a counter that changes on every mistake so the animation replays
  const [shake, setShake] = useState<{ slot: number; count: number } | null>(null)

  if (!phrase || !challenge) return <Navigate to="/onboarding/create" replace />

  const nextSlot = picked.length // the slot we're currently filling
  const done = nextSlot === challenge.positions.length

  const choose = (word: string) => {
    if (done) return
    if (word === phrase[challenge.positions[nextSlot]]) {
      haptics.tap()
      setPicked((p) => [...p, word])
      setShake(null)
    } else {
      // Wrong word: shake the slot and buzz
      haptics.error()
      setShake((prev) => ({ slot: nextSlot, count: (prev?.count ?? 0) + 1 }))
    }
  }

  const confirm = () => {
    createWallet(phrase)
    haptics.success()
    // The wallet's status is now "needsPin", so the route guard sends us on to the PIN screen.
    // (The draft is cleared after the PIN is set; clearing it here would race the redirect.)
  }

  return (
    <Screen
      header={<TopBar title="Confirm phrase" onBack={() => navigate('/onboarding/seed')} />}
      footer={
        <Button disabled={!done} onClick={confirm}>
          Confirm
        </Button>
      }
    >
      <StepProgress step={3} />
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Let’s check your backup</h1>
        <p className="text-text-muted">Tap the right word for each empty slot.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {challenge.positions.map((position, slot) => {
          const isWrong = shake?.slot === slot
          return (
            <div key={slot} className="flex flex-col gap-1.5">
              <span className="text-caption text-text-muted">Word #{position + 1}</span>
              <div
                key={isWrong ? shake.count : 'ok'}
                className={cx(isWrong && 'animate-shake [&>*]:border-negative')}
              >
                <SeedWord
                  number={position + 1}
                  word={picked[slot]}
                  state={picked[slot] ? 'selected' : 'empty'}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-small font-semibold">{done ? 'All correct!' : 'Choose a word'}</h2>
        <div className="grid grid-cols-3 gap-3">
          {challenge.options.map((word) => (
            <SeedWord
              key={word}
              word={word}
              onClick={() => choose(word)}
              disabled={picked.includes(word) || done}
            />
          ))}
        </div>
      </div>
    </Screen>
  )
}
