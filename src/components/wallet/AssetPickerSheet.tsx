import { BottomSheet } from '@/components/ui/BottomSheet'
import { CoinLogo } from '@/components/ui/CoinLogo'
import { useMarkets } from '@/hooks/useMarkets'
import { cx } from '@/lib/cx'
import { formatCrypto, formatFiat } from '@/lib/format'
import { useWalletStore } from '@/store/walletStore'

type AssetPickerSheetProps = {
  open: boolean
  onClose: () => void
  selectedId: string
  onSelect: (coinId: string) => void
  /** Send needs a balance; Receive can be any supported coin */
  onlyOwned?: boolean
  title?: string
}

/** Bottom sheet listing coins with your balance in each. Used by Send, Receive (and Swap later). */
export function AssetPickerSheet({
  open,
  onClose,
  selectedId,
  onSelect,
  onlyOwned,
  title = 'Choose a coin',
}: AssetPickerSheetProps) {
  const currency = useWalletStore((s) => s.currency)
  const holdings = useWalletStore((s) => s.holdings)
  const coins = useMarkets().data?.coins ?? []

  const rows = coins
    .map((coin) => ({ coin, amount: holdings.find((h) => h.coinId === coin.id)?.amount ?? 0 }))
    .filter((r) => !onlyOwned || r.amount > 0)
    // Coins you own first (biggest value first), then the rest by market cap
    .sort((a, b) => b.amount * b.coin.current_price - a.amount * a.coin.current_price)

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <ul className="-mx-2 flex max-h-[60dvh] flex-col overflow-y-auto">
        {rows.map(({ coin, amount }) => (
          <li key={coin.id}>
            <button
              type="button"
              onClick={() => {
                onSelect(coin.id)
                onClose()
              }}
              className={cx(
                'flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left',
                coin.id === selectedId ? 'bg-surface-raised' : 'active:bg-surface-raised',
              )}
            >
              <CoinLogo image={coin.image} symbol={coin.symbol} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">{coin.name}</span>
                <span className="text-caption text-text-muted numeric">
                  {formatCrypto(amount, coin.symbol)}
                </span>
              </span>
              <span className="numeric text-small font-semibold">
                {amount > 0 ? formatFiat(amount * coin.current_price, currency) : ''}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  )
}
