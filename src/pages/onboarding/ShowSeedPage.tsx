import { useState, type SyntheticEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { NoticeCard } from '@/components/ui/NoticeCard'
import { Screen } from '@/components/ui/Screen'
import { SeedWord } from '@/components/ui/SeedWord'
import { StepProgress } from '@/components/ui/StepProgress'
import { TopBar } from '@/components/ui/TopBar'
import { useScreenPrivacy, type PrivacyRisk } from '@/hooks/useScreenPrivacy'
import { cx } from '@/lib/cx'
import { haptics } from '@/lib/haptics'
import { useOnboardingStore } from '@/store/onboardingStore'

// What the cover says after the words were hidden automatically
const hiddenBecause: Record<PrivacyRisk, string> = {
  background: 'Hidden because you left the app',
  blur: 'Hidden because Kova lost focus',
  screenshot: 'Screenshots aren’t safe. Write the words on paper instead.',
  print: 'Printing your phrase isn’t allowed',
}

// Stops the words being copied or long-pressed into a "Copy" menu
const block = (e: SyntheticEvent) => e.preventDefault()

export default function ShowSeedPage() {
  const navigate = useNavigate()
  const phrase = useOnboardingStore((s) => s.draftPhrase)
  // Words start hidden: someone might be looking over your shoulder
  const [visible, setVisible] = useState(false)
  const [seenOnce, setSeenOnce] = useState(false)
  const [hiddenReason, setHiddenReason] = useState<PrivacyRisk | null>(null)

  // A web app can't block screenshots, so we hide the words at the moments a capture is likely
  useScreenPrivacy((risk) => {
    setVisible(false)
    setHiddenReason(risk)
    if (risk === 'screenshot') haptics.error()
  }, visible)

  // Landed here directly (e.g. refreshed the page)? The draft is gone, so start again.
  if (!phrase) return <Navigate to="/onboarding/create" replace />

  const reveal = () => {
    setVisible(true)
    setSeenOnce(true)
    setHiddenReason(null)
  }

  return (
    <Screen
      header={<TopBar title="Recovery phrase" onBack={() => navigate('/onboarding/create')} />}
      footer={
        <>
          <Button disabled={!seenOnce} onClick={() => navigate('/onboarding/seed/confirm')}>
            I’ve written it down
          </Button>
          <Button
            variant="ghost"
            icon={visible ? 'eye-off' : 'eye'}
            onClick={() => (visible ? setVisible(false) : reveal())}
          >
            {visible ? 'Hide words' : 'Show words'}
          </Button>
        </>
      }
    >
      <StepProgress step={2} />
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Write down these 12 words</h1>
        <p className="text-text-muted">
          In this exact order, on paper. Don’t screenshot or copy them.
        </p>
      </div>

      <div className="relative">
        <ol
          aria-label="Recovery phrase"
          aria-hidden={!visible}
          data-sensitive
          onCopy={block}
          onCut={block}
          onContextMenu={block}
          className={cx(
            'grid grid-cols-3 gap-3 transition-[filter] duration-300 select-none',
            !visible && 'pointer-events-none blur-md',
          )}
        >
          {phrase.map((word, i) => (
            <li key={i}>
              <SeedWord number={i + 1} word={word} />
            </li>
          ))}
        </ol>
        {!visible && (
          <button
            type="button"
            onClick={reveal}
            className="bg-surface/70 text-small absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg px-6 text-center font-semibold backdrop-blur-sm"
          >
            <Icon name={hiddenReason ? 'shield' : 'eye'} />
            {hiddenReason ? hiddenBecause[hiddenReason] : 'Tap to reveal your phrase'}
            <span className="text-caption text-text-muted font-normal">
              {hiddenReason ? 'Tap to show it again' : 'Make sure no one is watching'}
            </span>
          </button>
        )}
      </div>

      <NoticeCard tone="warning">
        Never share your phrase. Kova support will never ask for it.
      </NoticeCard>
    </Screen>
  )
}
