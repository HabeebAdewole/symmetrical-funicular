import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { CheckboxRow } from '@/components/ui/CheckboxRow'
import { Screen } from '@/components/ui/Screen'
import { StepProgress } from '@/components/ui/StepProgress'
import { TopBar } from '@/components/ui/TopBar'
import { useOnboardingStore } from '@/store/onboardingStore'

const acknowledgements = [
  'Kova never stores my recovery phrase. It stays on this device.',
  'If I lose my recovery phrase, nobody can recover my wallet — not even Kova.',
  'Anyone with my recovery phrase can take everything in this wallet.',
]

export default function CreateWalletPage() {
  const navigate = useNavigate()
  const startDraft = useOnboardingStore((s) => s.startDraft)
  const [checked, setChecked] = useState(acknowledgements.map(() => false))
  const allChecked = checked.every(Boolean)

  const toggle = (index: number, value: boolean) =>
    setChecked((prev) => prev.map((old, i) => (i === index ? value : old)))

  const next = () => {
    startDraft() // generates the 12 words (kept in memory only)
    navigate('/onboarding/seed')
  }

  return (
    <Screen
      header={<TopBar title="Create wallet" onBack={() => navigate('/welcome')} />}
      footer={
        <>
          <Button disabled={!allChecked} onClick={next}>
            Show my recovery phrase
          </Button>
          {!allChecked && (
            <p className="text-caption text-text-muted text-center">Tick all three to continue</p>
          )}
        </>
      }
    >
      <StepProgress step={1} />
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Before we start</h1>
        <p className="text-text-muted">
          Your wallet is protected by a 12-word recovery phrase. Only you will ever see it.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {acknowledgements.map((text, i) => (
          <CheckboxRow key={text} checked={checked[i]} onChange={(value) => toggle(i, value)}>
            {text}
          </CheckboxRow>
        ))}
      </div>
    </Screen>
  )
}
