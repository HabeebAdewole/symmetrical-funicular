import { useMemo, useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { CoinLogo } from '@/components/ui/CoinLogo'
import { Input } from '@/components/ui/Input'
import { Screen } from '@/components/ui/Screen'
import { TopBar } from '@/components/ui/TopBar'
import { AssetPickerSheet } from '@/components/wallet/AssetPickerSheet'
import type { MarketCoin } from '@/lib/coingecko'
import { readText } from '@/lib/clipboard'
import { formatCrypto, shortenAddress } from '@/lib/format'
import { networkForCoin } from '@/lib/mockCrypto'
import { networkOf } from '@/lib/networks'
import { useWalletStore } from '@/store/walletStore'

type RecipientStepProps = {
  coin: MarketCoin | undefined
  coinId: string
  balance: number
  ownAddress: string
  to: string
  onCoinChange: (coinId: string) => void
  onToChange: (to: string) => void
  onBack: () => void
  onNext: () => void
}

/** Send 1/4 (Figma 22:348): pick the coin and who it's going to. */
export function RecipientStep(props: RecipientStepProps) {
  const { coin, coinId, balance, ownAddress, to, onCoinChange, onToChange, onBack, onNext } = props
  const transactions = useWalletStore((s) => s.transactions)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [touched, setTouched] = useState(false)
  const network = networkOf(coinId)

  // Addresses you've sent to before on this network (newest first, no duplicates)
  const recent = useMemo(() => {
    const net = networkForCoin(coinId)
    const seen = new Set<string>()
    return transactions
      .filter((t) => t.type === 'send' && t.counterparty && networkForCoin(t.coinId) === net)
      .map((t) => t.counterparty!)
      .filter((a) => !seen.has(a) && seen.add(a))
      .slice(0, 3)
  }, [transactions, coinId])

  const trimmed = to.trim()
  const error = !trimmed
    ? null
    : trimmed === ownAddress
      ? 'That’s your own address. Pick someone else to send to.'
      : !network.isValidAddress(trimmed)
        ? `That doesn’t look like a ${network.name} address`
        : null
  const valid = !!trimmed && !error

  const paste = async () => {
    const text = (await readText()).trim()
    if (text) {
      onToChange(text)
      setTouched(true)
    }
  }

  return (
    <Screen
      header={<TopBar title="Send" onBack={onBack} />}
      footer={
        <Button disabled={!valid} onClick={onNext}>
          Continue
        </Button>
      }
    >
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="bg-surface flex items-center gap-3 rounded-lg p-4 text-left"
      >
        <CoinLogo image={coin?.image} symbol={coin?.symbol ?? '?'} />
        <span className="flex flex-1 flex-col">
          <span className="font-semibold">{coin?.name ?? '…'}</span>
          <span className="text-caption text-text-muted numeric">
            {formatCrypto(balance, coin?.symbol ?? '')} available
          </span>
        </span>
        <Icon name="chevron-down" className="text-text-muted" />
      </button>

      <Input
        label="To"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={networkForCoin(coinId) === 'ethereum' ? '0x…' : 'Paste an address'}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        helper={network.addressHint}
        // Only complain once they've finished typing (left the field) or pasted
        error={touched ? (error ?? undefined) : undefined}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={paste}
          className="bg-surface-raised text-small flex items-center gap-1.5 rounded-full px-3.5 py-2 font-semibold"
        >
          <Icon name="copy" size={18} /> Paste
        </button>
      </div>

      {recent.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Recent</h2>
          <ul className="bg-surface rounded-lg px-2 py-1">
            {recent.map((address) => (
              <li key={address}>
                <button
                  type="button"
                  onClick={() => {
                    onToChange(address)
                    setTouched(true)
                  }}
                  className="active:bg-surface-raised flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left"
                >
                  <span className="bg-surface-raised flex size-10 items-center justify-center rounded-full">
                    <Icon name="wallet" size={20} />
                  </span>
                  <span className="numeric flex-1 font-semibold">{shortenAddress(address, 6)}</span>
                  <Icon name="chevron-right" size={20} className="text-text-muted" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AssetPickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedId={coinId}
        onSelect={onCoinChange}
        onlyOwned
        title="Send which coin?"
      />
    </Screen>
  )
}
