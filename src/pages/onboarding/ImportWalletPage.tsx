import { useId, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { NoticeCard } from '@/components/ui/NoticeCard'
import { Screen } from '@/components/ui/Screen'
import { TopBar } from '@/components/ui/TopBar'
import { cx } from '@/lib/cx'
import { haptics } from '@/lib/haptics'
import { generateSeedPhrase, validateSeedPhrase } from '@/lib/mockCrypto'
import { useWalletStore } from '@/store/walletStore'

export default function ImportWalletPage() {
  const navigate = useNavigate()
  const importWallet = useWalletStore((s) => s.importWallet)
  const fieldId = useId()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const target = wordCount > 12 ? 24 : 12
  const countReady = wordCount === 12 || wordCount === 24

  const submit = () => {
    const result = validateSeedPhrase(text)
    if (!result.ok) {
      haptics.error()
      setError(result.error)
      return
    }
    haptics.success()
    importWallet(result.words) // status → needsPin, so the route guard moves on to Set PIN
  }

  return (
    <Screen
      header={<TopBar title="Import wallet" onBack={() => navigate('/welcome')} />}
      footer={
        <>
          <Button disabled={!countReady} onClick={submit}>
            Import wallet
          </Button>
          {/* Handy for anyone reviewing the demo: fills in a valid Kova phrase */}
          <Button
            variant="ghost"
            icon="key"
            onClick={() => {
              setText(generateSeedPhrase().join(' '))
              setError(null)
            }}
          >
            Use a demo phrase
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 font-bold">Restore your wallet</h1>
        <p className="text-text-muted">
          Enter your 12 or 24-word recovery phrase, with a space between each word.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId} className="text-small font-semibold">
          Recovery phrase
        </label>
        <textarea
          id={fieldId}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setError(null)
          }}
          rows={5}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="valley crater otter …"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${fieldId}-hint`}
          className={cx(
            'bg-surface text-body placeholder:text-text-muted w-full resize-none rounded-md p-4 outline-none',
            error
              ? 'border-negative border-2'
              : 'border-border focus:border-primary border focus:border-2',
          )}
        />
        <div id={`${fieldId}-hint`} className="text-caption flex justify-between gap-4">
          <span className={error ? 'text-negative' : 'text-text-muted'}>
            {error ?? 'Words are separated by spaces'}
          </span>
          <span className={cx('numeric shrink-0', countReady ? 'text-primary' : 'text-text-muted')}>
            {wordCount} / {target}
          </span>
        </div>
      </div>

      <NoticeCard>
        Demo only: Kova uses its own word list, so a real recovery phrase won’t work. Never paste
        one here.
      </NoticeCard>
    </Screen>
  )
}
