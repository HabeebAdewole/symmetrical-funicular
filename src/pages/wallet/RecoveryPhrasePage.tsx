import { useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { NoticeCard } from '@/components/ui/NoticeCard'
import { PinDots } from '@/components/ui/PinDots'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { Screen } from '@/components/ui/Screen'
import { SeedWord } from '@/components/ui/SeedWord'
import { TopBar } from '@/components/ui/TopBar'
import { usePinInput } from '@/hooks/usePinInput'
import { useScreenPrivacy } from '@/hooks/useScreenPrivacy'
import { cx } from '@/lib/cx'
import { useWalletStore } from '@/store/walletStore'

const block = (e: SyntheticEvent) => e.preventDefault()

/** Settings → Recovery phrase. PIN first, then the words, blurred until tapped (same protections as onboarding). */
export default function RecoveryPhrasePage() {
  const navigate = useNavigate()
  const phrase = useWalletStore((s) => s.seedPhrase) ?? []
  const verifyPin = useWalletStore((s) => s.verifyPin)
  const [unlocked, setUnlocked] = useState(false)
  const [visible, setVisible] = useState(false)
  const [wrong, setWrong] = useState(false)

  const pin = usePinInput(async (entered, { fail }) => {
    if (await verifyPin(entered)) setUnlocked(true)
    else {
      setWrong(true)
      fail()
    }
  })

  // Leaving the app, screenshot keys or printing hide the words again
  useScreenPrivacy(() => setVisible(false), visible)

  if (!unlocked) {
    return (
      <Screen header={<TopBar title="Recovery phrase" onBack={() => navigate(-1)} />} centered>
        <span className="bg-surface-raised flex size-16 items-center justify-center rounded-full">
          <Icon name="key" size={28} />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-h1 font-bold">Enter your PIN</h1>
          <p aria-live="polite" className={wrong ? 'text-negative' : 'text-text-muted'}>
            {wrong ? 'Wrong PIN. Try again.' : 'Your recovery phrase is the key to your wallet.'}
          </p>
        </div>
        <PinDots filled={pin.value.length} error={pin.error} />
        <div className="mt-auto w-full pb-[max(env(safe-area-inset-bottom),1.5rem)]">
          <PinKeypad onDigit={pin.add} onBackspace={pin.remove} disabled={pin.busy} />
        </div>
      </Screen>
    )
  }

  return (
    <Screen
      header={<TopBar title="Recovery phrase" onBack={() => navigate('/settings')} />}
      footer={
        <Button
          variant="secondary"
          icon={visible ? 'eye-off' : 'eye'}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'Hide words' : 'Show words'}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Your 12 words</h1>
        <p className="text-text-muted">
          Check them against your paper backup. Never type them anywhere else.
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
            onClick={() => setVisible(true)}
            className="bg-surface/70 text-small absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg font-semibold backdrop-blur-sm"
          >
            <Icon name="eye" />
            Tap to reveal
          </button>
        )}
      </div>

      <NoticeCard tone="warning">
        Anyone with these words can take everything in this wallet. Kova support will never ask for
        them.
      </NoticeCard>
    </Screen>
  )
}
