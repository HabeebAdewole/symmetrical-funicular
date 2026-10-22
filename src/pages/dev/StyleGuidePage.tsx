import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon, type IconName } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { CheckboxRow } from '@/components/ui/CheckboxRow'
import { CoinRow } from '@/components/ui/CoinRow'
import { HeroBalanceCard } from '@/components/ui/HeroBalanceCard'
import { Input } from '@/components/ui/Input'
import { KovaLogo } from '@/components/ui/KovaLogo'
import { NoticeCard } from '@/components/ui/NoticeCard'
import { PagerDots } from '@/components/ui/PagerDots'
import { PinDots } from '@/components/ui/PinDots'
import { PinKeypad } from '@/components/ui/PinKeypad'
import { QuickAction } from '@/components/ui/QuickAction'
import { SeedWord } from '@/components/ui/SeedWord'
import { StepProgress } from '@/components/ui/StepProgress'
import { TopBar } from '@/components/ui/TopBar'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { useMarkets } from '@/hooks/useMarkets'
import { cx } from '@/lib/cx'
import { formatFiat } from '@/lib/format'
import { usePreferencesStore, type ThemePreference } from '@/store/preferencesStore'

// A living style guide: every design-system component in every state, using the real code.
// Mirrors the Foundations + Components pages of the Figma file.

const colorTokens = [
  'bg',
  'surface',
  'surface-raised',
  'border',
  'text',
  'text-muted',
  'primary',
  'on-primary',
  'highlight',
  'on-highlight',
  'hero-start',
  'hero-end',
  'positive',
  'negative',
  'warning',
]
const iconNames: IconName[] = [
  'send',
  'receive',
  'swap',
  'plus',
  'home',
  'market',
  'activity',
  'settings',
  'bell',
  'eye',
  'eye-off',
  'copy',
  'chevron-left',
  'chevron-right',
  'check',
  'shield',
  'key',
  'import',
  'backspace',
  'lock',
  'wallet',
  'close',
  'alert',
  'scan',
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-caption text-text-muted font-semibold tracking-wider uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ThemeSwitch() {
  const { theme, setTheme } = usePreferencesStore()
  return (
    <div role="radiogroup" aria-label="Theme" className="bg-surface-raised flex rounded-full p-1">
      {(['system', 'light', 'dark'] as ThemePreference[]).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={theme === option}
          onClick={() => setTheme(option)}
          className={cx(
            'text-small rounded-full px-4 py-1.5 font-semibold capitalize',
            theme === option ? 'bg-surface shadow-card' : 'text-text-muted',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default function StyleGuidePage() {
  const [checks, setChecks] = useState([true, false])
  const [pin, setPin] = useState('')
  const [hidden, setHidden] = useState(false)
  const { data } = useMarkets()
  const installPrompt = useInstallPrompt()

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-12 px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <KovaLogo />
          <p className="text-small text-text-muted">Design system · living style guide</p>
        </div>
        <ThemeSwitch />
      </header>

      <Section title="Colour">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {colorTokens.map((token) => (
            <div key={token} className="flex flex-col gap-1.5">
              <span
                className="border-border h-14 rounded-lg border"
                style={{ background: `var(--color-${token})` }}
              />
              <span className="text-caption text-text-muted">{token}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type · Plus Jakarta Sans">
        <p className="numeric text-display font-extrabold">$12,480.55</p>
        <p className="text-h1 font-bold">Your wallet is ready</p>
        <p className="text-h2 font-bold">Write down your recovery phrase</p>
        <p className="text-body">Anyone with these 12 words can access your wallet.</p>
        <p className="text-small text-text-muted">Prices update every 60 seconds</p>
        <p className="text-caption font-medium tracking-wide uppercase">Live from CoinGecko</p>
      </Section>

      <Section title="Icons">
        <div className="grid grid-cols-8 gap-4 sm:grid-cols-12">
          {iconNames.map((name) => (
            <span key={name} title={name} className="flex justify-center">
              <Icon name={name} />
            </span>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button>Create a new wallet</Button>
          <Button disabled>Create a new wallet</Button>
          <Button variant="secondary">I already have a wallet</Button>
          <Button variant="secondary" disabled>
            I already have a wallet
          </Button>
          <Button variant="ghost" icon="eye-off">
            Hide words
          </Button>
          <Button variant="ghost" disabled>
            Hide words
          </Button>
        </div>
      </Section>

      <Section title="Quick actions">
        <div className="flex justify-between sm:justify-start sm:gap-8">
          <QuickAction icon="send" label="Send" tone="filled" />
          <QuickAction icon="receive" label="Receive" tone="filled" />
          <QuickAction icon="swap" label="Swap" />
          <QuickAction icon="plus" label="Buy" />
        </div>
      </Section>

      <Section title="Inputs">
        <Input
          label="Recipient address"
          placeholder="0x… or ENS name"
          helper="Double-check the first and last 4 characters"
        />
        <Input
          label="Recipient address"
          defaultValue="0x71C7"
          error="That doesn’t look like a valid address"
        />
      </Section>

      <Section title="Checkbox rows">
        {[
          'Kova never stores my recovery phrase.',
          'If I lose my phrase, nobody can recover my wallet.',
        ].map((label, i) => (
          <CheckboxRow
            key={label}
            checked={checks[i]}
            onChange={(value) => setChecks((c) => c.map((old, j) => (j === i ? value : old)))}
          >
            {label}
          </CheckboxRow>
        ))}
      </Section>

      <Section title="Seed words">
        <div className="grid max-w-[350px] grid-cols-3 gap-3">
          <SeedWord number={1} word="valley" />
          <SeedWord number={2} word="crater" state="selected" />
          <SeedWord number={3} state="empty" />
          <SeedWord word="hazel" onClick={() => {}} />
          <SeedWord word="kayak" onClick={() => {}} />
          <SeedWord word="otter" onClick={() => {}} disabled />
        </div>
      </Section>

      <Section title="PIN (try typing)">
        <div className="flex max-w-[350px] flex-col items-center gap-8">
          <PinDots filled={pin.length} />
          <PinKeypad
            onDigit={(d) => setPin((p) => (p.length < 6 ? p + d : p))}
            onBackspace={() => setPin((p) => p.slice(0, -1))}
          />
        </div>
      </Section>

      <Section title="Navigation">
        <div className="bg-surface-raised max-w-[390px] rounded-lg">
          <TopBar title="Recovery phrase" onBack={() => {}} />
        </div>
        <StepProgress step={2} />
        <PagerDots count={3} active={0} />
      </Section>

      <Section title="Hero balance card">
        <div className="max-w-[350px]">
          <HeroBalanceCard
            balance="$12,480.55"
            change="+$291.40 · 2.4% today"
            hidden={hidden}
            onToggleHidden={() => setHidden((h) => !h)}
          />
        </div>
      </Section>

      <Section title="Coin rows (live prices)">
        <div className="flex max-w-[350px] flex-col gap-2">
          {data?.coins.slice(0, 3).map((coin) => (
            <CoinRow
              key={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              image={coin.image}
              subtitle={coin.symbol.toUpperCase()}
              value={formatFiat(coin.current_price)}
              change={coin.price_change_percentage_24h}
              onClick={() => {}}
            />
          ))}
        </div>
      </Section>

      <Section title="Notices">
        <NoticeCard tone="warning">
          Never share your phrase. Kova support will never ask for it.
        </NoticeCard>
        <NoticeCard>Demo only: no real money moves in Kova.</NoticeCard>
      </Section>

      <Section title="Install (PWA)">
        {installPrompt.installed ? (
          <NoticeCard>Kova is installed and running as an app.</NoticeCard>
        ) : installPrompt.canInstall ? (
          <Button icon="import" onClick={installPrompt.install}>
            Install Kova
          </Button>
        ) : installPrompt.showIosHint ? (
          <NoticeCard>On iPhone: tap Share, then “Add to Home Screen”.</NoticeCard>
        ) : (
          <NoticeCard>
            Open Kova in Chrome on Android, or Safari on iPhone, to install it.
          </NoticeCard>
        )}
      </Section>

      <Link to="/" className="text-small text-primary font-semibold">
        ← Back to the app
      </Link>
    </div>
  )
}
