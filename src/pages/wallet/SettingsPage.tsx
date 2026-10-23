import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { OptionSheet } from '@/components/settings/OptionSheet'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { KovaLogo } from '@/components/ui/KovaLogo'
import { Toggle } from '@/components/ui/Toggle'
import { PinConfirmSheet } from '@/components/wallet/PinConfirmSheet'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { copyText } from '@/lib/clipboard'
import { shortenAddress, type FiatCurrency } from '@/lib/format'
import { initials } from '@/lib/greeting'
import { haptics } from '@/lib/haptics'
import { usePreferencesStore, type AutoLock, type ThemePreference } from '@/store/preferencesStore'
import { useWalletStore } from '@/store/walletStore'

const REPO_URL = 'https://github.com/HabeebAdewole/symmetrical-funicular'

const currencies: { value: FiatCurrency; label: string; hint: string }[] = [
  { value: 'usd', label: 'US Dollar', hint: 'USD · $' },
  { value: 'eur', label: 'Euro', hint: 'EUR · €' },
  { value: 'gbp', label: 'British Pound', hint: 'GBP · £' },
  { value: 'ngn', label: 'Nigerian Naira', hint: 'NGN · ₦' },
]
const themes: { value: ThemePreference; label: string; hint?: string }[] = [
  { value: 'system', label: 'System', hint: 'Follow your phone’s setting' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]
const autoLocks: { value: AutoLock; label: string }[] = [
  { value: 0, label: 'Immediately' },
  { value: 60_000, label: 'After 1 minute' },
  { value: 300_000, label: 'After 5 minutes' },
  { value: -1, label: 'Never' },
]

type Sheet = 'name' | 'currency' | 'theme' | 'autoLock' | 'about' | 'reset' | null

export default function SettingsPage() {
  const navigate = useNavigate()
  const wallet = useWalletStore()
  const prefs = usePreferencesStore()
  const address = useWalletAddress('ethereum')
  const [sheet, setSheet] = useState<Sheet>(null)
  const [nameDraft, setNameDraft] = useState(prefs.displayName)
  const [copied, setCopied] = useState(false)
  const close = () => setSheet(null)

  const label = <T,>(list: { value: T; label: string }[], value: T) =>
    list.find((o) => o.value === value)?.label ?? ''

  const copyAddress = async () => {
    if (await copyText(address)) {
      haptics.tap()
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-3 pb-4">
      <h1 className="text-h1 font-bold">Settings</h1>

      {/* Profile card */}
      <section className="bg-surface flex items-center gap-3 rounded-lg p-4">
        <button
          type="button"
          onClick={() => {
            setNameDraft(prefs.displayName)
            setSheet('name')
          }}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {prefs.displayName ? (
            <span className="bg-highlight text-on-highlight flex size-12 shrink-0 items-center justify-center rounded-full font-semibold">
              {initials(prefs.displayName)}
            </span>
          ) : (
            <KovaLogo wordmark={false} size={48} />
          )}
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-semibold">
              {prefs.displayName ? `${prefs.displayName}’s wallet` : 'Add your name'}
            </span>
            <span className="text-caption text-text-muted">Tap to edit</span>
          </span>
        </button>
        <button
          type="button"
          onClick={copyAddress}
          aria-label="Copy your Ethereum address"
          className="text-caption text-text-muted numeric flex items-center gap-1.5"
        >
          {copied ? 'Copied' : shortenAddress(address)}
          <Icon name={copied ? 'check' : 'copy'} size={16} />
        </button>
      </section>

      <SettingsGroup title="Security">
        <SettingsRow icon="lock" label="Change PIN" onClick={() => navigate('/settings/pin')} />
        <SettingsRow
          icon="key"
          label="Recovery phrase"
          value="View"
          onClick={() => navigate('/settings/recovery-phrase')}
        />
        <SettingsRow
          icon="activity"
          label="Auto-lock"
          value={label(autoLocks, prefs.autoLock)}
          onClick={() => setSheet('autoLock')}
        />
        <SettingsRow
          icon="fingerprint"
          label="Unlock with biometrics"
          trailing={
            <Toggle
              checked={prefs.biometrics}
              onChange={prefs.setBiometrics}
              label="Unlock with biometrics"
            />
          }
        />
        <SettingsRow icon="shield" label="Lock Kova now" onClick={wallet.lock} />
      </SettingsGroup>
      {prefs.biometrics && (
        <p className="text-caption text-text-muted -mt-3 px-1">
          Demo setting: web apps can’t use Face ID or fingerprint the way native apps do, so Kova
          still unlocks with your PIN.
        </p>
      )}

      <SettingsGroup title="Preferences">
        <SettingsRow
          icon="coins"
          label="Currency"
          value={wallet.currency.toUpperCase()}
          onClick={() => setSheet('currency')}
        />
        <SettingsRow
          icon="moon"
          label="Appearance"
          value={label(themes, prefs.theme)}
          onClick={() => setSheet('theme')}
        />
        <SettingsRow
          icon="bell"
          label="Price alerts"
          trailing={
            <Toggle
              checked={prefs.priceAlerts}
              onChange={prefs.setPriceAlerts}
              label="Price alerts"
            />
          }
        />
        <SettingsRow icon="globe" label="Network" value="Mainnet (demo)" />
      </SettingsGroup>

      <SettingsGroup title="About">
        <SettingsRow
          icon="info"
          label="About Kova"
          value="v1.0"
          onClick={() => setSheet('about')}
        />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow icon="alert" label="Reset wallet" danger onClick={() => setSheet('reset')} />
      </SettingsGroup>

      <p className="text-caption text-text-muted text-center">
        Kova v1.0 · Demo only, no real funds
      </p>

      {/* ---------- Sheets ---------- */}
      <BottomSheet open={sheet === 'name'} onClose={close} title="Your name">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            prefs.setDisplayName(nameDraft)
            close()
          }}
        >
          <Input
            label="Display name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
            helper="Shown in your Home greeting. Only stored on this device."
          />
          <Button type="submit">Save</Button>
        </form>
      </BottomSheet>

      <OptionSheet
        open={sheet === 'currency'}
        onClose={close}
        title="Currency"
        options={currencies}
        value={wallet.currency}
        onSelect={wallet.setCurrency}
      />
      <OptionSheet
        open={sheet === 'theme'}
        onClose={close}
        title="Appearance"
        options={themes}
        value={prefs.theme}
        onSelect={prefs.setTheme}
      />
      <OptionSheet
        open={sheet === 'autoLock'}
        onClose={close}
        title="Auto-lock"
        options={autoLocks}
        value={prefs.autoLock}
        onSelect={prefs.setAutoLock}
      />

      <BottomSheet open={sheet === 'about'} onClose={close} title="About Kova">
        <p className="text-text-muted">
          Kova is a portfolio demo of a mobile crypto wallet. Prices are live from CoinGecko;
          everything else (recovery phrases, addresses, balances and transactions) is simulated. No
          real money ever moves.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/ui" className="text-primary font-semibold" onClick={close}>
            Design system style guide →
          </Link>
          <Link to="/admin" className="text-primary font-semibold" onClick={close}>
            Admin back office →
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-primary font-semibold"
          >
            Source code on GitHub ↗
          </a>
        </div>
      </BottomSheet>

      {/* Resetting is serious, so it needs the PIN, like a real wallet */}
      <PinConfirmSheet
        open={sheet === 'reset'}
        onClose={close}
        onConfirmed={wallet.reset}
        title="Reset this wallet?"
        message="This removes the wallet from this device. You’ll need your recovery phrase to get it back. Enter your PIN to continue."
      />
    </div>
  )
}
