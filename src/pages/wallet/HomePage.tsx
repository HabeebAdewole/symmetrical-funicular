import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HomeHeader } from '@/components/home/HomeHeader'
import { AreaSparkline } from '@/components/ui/AreaSparkline'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { CoinRow } from '@/components/ui/CoinRow'
import { HeroBalanceCard } from '@/components/ui/HeroBalanceCard'
import { QuickAction } from '@/components/ui/QuickAction'
import { Skeleton } from '@/components/ui/Skeleton'
import { useNotifications } from '@/hooks/useNotifications'
import { usePortfolio } from '@/hooks/usePortfolio'
import { usePortfolioHistory } from '@/hooks/usePortfolioHistory'
import { cx } from '@/lib/cx'
import { formatCrypto, formatFiat, type FiatCurrency } from '@/lib/format'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useWalletStore } from '@/store/walletStore'

const PREVIEW_COUNT = 4
const HIDDEN = '••••'

/** "+$291.40 (2.40%) today" / "−$156.20 (1.10%) today" — one sign, at the front */
const describeChange = (amount: number, percent: number, currency: FiatCurrency, period: string) =>
  `${amount >= 0 ? '+' : '−'}${formatFiat(Math.abs(amount), currency)} (${Math.abs(percent).toFixed(2)}%) ${period}`

export default function HomePage() {
  const navigate = useNavigate()
  const currency = useWalletStore((s) => s.currency)
  const hideBalances = useWalletStore((s) => s.hideBalances)
  const toggleHideBalances = useWalletStore((s) => s.toggleHideBalances)
  const { unreadCount } = useNotifications()
  const displayName = usePreferencesStore((s) => s.displayName)
  const portfolio = usePortfolio()
  const history = usePortfolioHistory()
  const [showAll, setShowAll] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)

  const assets = showAll ? portfolio.assets : portfolio.assets.slice(0, PREVIEW_COUNT)
  const weekUp = history.change >= 0

  return (
    <div className="flex flex-col gap-5 px-5 pt-3 pb-4">
      <HomeHeader name={displayName} hasUnread={unreadCount > 0} />

      {portfolio.isLoading ? (
        <Skeleton className="h-37 rounded-xl" />
      ) : (
        <HeroBalanceCard
          balance={formatFiat(portfolio.totalValue, currency)}
          change={describeChange(
            portfolio.change24h,
            portfolio.change24hPercent,
            currency,
            'today',
          )}
          hidden={hideBalances}
          onToggleHidden={toggleHideBalances}
        />
      )}

      <nav
        aria-label="Quick actions"
        className="bg-surface flex justify-between rounded-lg px-5 py-4"
      >
        <QuickAction icon="send" label="Send" tone="filled" onClick={() => navigate('/send')} />
        <QuickAction
          icon="receive"
          label="Receive"
          tone="filled"
          onClick={() => navigate('/receive')}
        />
        <QuickAction icon="swap" label="Swap" onClick={() => navigate('/swap')} />
        <QuickAction icon="plus" label="Buy" onClick={() => setBuyOpen(true)} />
      </nav>

      {history.values.length > 1 && (
        <section
          aria-label="Portfolio, last 7 days"
          className="bg-surface flex flex-col gap-3 rounded-lg pt-4"
        >
          <div className="flex items-baseline justify-between px-4">
            <h2 className="font-semibold">Portfolio</h2>
            <span className="text-caption text-text-muted">Last 7 days</span>
          </div>
          <p
            className={cx(
              'numeric text-small px-4 font-semibold',
              hideBalances ? 'text-text-muted' : weekUp ? 'text-positive' : 'text-negative',
            )}
          >
            {hideBalances
              ? HIDDEN
              : describeChange(history.change, history.changePercent, currency, 'this week')}
          </p>
          <div className="overflow-hidden rounded-b-lg">
            <AreaSparkline values={history.values} positive={weekUp} />
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Your assets</h2>
          {portfolio.assets.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-small text-primary font-semibold"
            >
              {showAll ? 'Show less' : `See all (${portfolio.assets.length})`}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {portfolio.isLoading
            ? Array.from({ length: PREVIEW_COUNT }, (_, i) => (
                <Skeleton key={i} className="h-18 rounded-lg" />
              ))
            : assets.map(({ coin, amount, value }) => (
                <CoinRow
                  key={coin.id}
                  name={coin.name}
                  symbol={coin.symbol}
                  image={coin.image}
                  subtitle={hideBalances ? HIDDEN : formatCrypto(amount, coin.symbol)}
                  value={hideBalances ? HIDDEN : formatFiat(value, currency)}
                  change={coin.price_change_percentage_24h}
                  onClick={() => navigate(`/asset/${coin.id}`)}
                />
              ))}
        </div>
        {portfolio.isFallback && (
          <p className="text-caption text-text-muted text-center">
            Showing sample prices. You’re offline or CoinGecko is busy.
          </p>
        )}
      </section>

      <BottomSheet open={buyOpen} onClose={() => setBuyOpen(false)} title="Buy crypto">
        <p className="text-text-muted">
          Kova is a demo, so there’s no card or bank to pay with. To add funds, share your wallet
          address from Receive.
        </p>
        <Button
          icon="receive"
          onClick={() => {
            setBuyOpen(false)
            navigate('/receive')
          }}
        >
          Go to Receive
        </Button>
        <Button variant="secondary" onClick={() => setBuyOpen(false)}>
          Close
        </Button>
      </BottomSheet>
    </div>
  )
}
