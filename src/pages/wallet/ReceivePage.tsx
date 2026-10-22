import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { CoinLogo } from '@/components/ui/CoinLogo'
import { NoticeCard } from '@/components/ui/NoticeCard'
import { Screen } from '@/components/ui/Screen'
import { TopBar } from '@/components/ui/TopBar'
import { AssetPickerSheet } from '@/components/wallet/AssetPickerSheet'
import { useMarketCoin } from '@/hooks/useMarkets'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { copyText } from '@/lib/clipboard'
import { haptics } from '@/lib/haptics'
import { networkOf } from '@/lib/networks'

// The Kova mark, drawn into the middle of the QR code (error-correction level "H" keeps it scannable)
const KOVA_MARK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><rect width="36" height="36" rx="11" fill="#0E6B52"/><path d="M13 10v16M13 18l9-8M13 18l9 8" stroke="#C6F432" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  )

export default function ReceivePage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const coinId = params.get('coin') ?? 'bitcoin'
  const { coin } = useMarketCoin(coinId)
  const address = useWalletAddress(coinId)
  const network = networkOf(coinId)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const symbol = coin?.symbol.toUpperCase() ?? ''

  const copy = async () => {
    const ok = await copyText(address)
    if (ok) haptics.success()
    setCopyState(ok ? 'copied' : 'failed')
    setTimeout(() => setCopyState('idle'), ok ? 2000 : 4000)
  }

  // Phones get the native share sheet (WhatsApp, Messages…); desktops just copy
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `My ${network.name} address`, text: address })
      } catch {
        // user closed the share sheet; nothing to do
      }
    } else {
      await copy()
    }
  }

  return (
    <Screen header={<TopBar title="Receive" onBack={() => navigate(-1)} />}>
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="bg-surface flex items-center gap-3 rounded-lg p-4 text-left"
      >
        <CoinLogo image={coin?.image} symbol={coin?.symbol ?? '?'} />
        <span className="flex flex-1 flex-col">
          <span className="font-semibold">{coin?.name ?? '…'}</span>
          <span className="text-caption text-text-muted">{network.name} network</span>
        </span>
        <Icon name="chevron-down" className="text-text-muted" />
      </button>

      <section className="bg-surface flex flex-col items-center gap-4 rounded-lg px-5 py-6">
        {/* QR codes must be dark-on-light to scan reliably, so the code keeps a white tile in dark mode too */}
        <div className="rounded-lg bg-white p-3">
          <QRCodeSVG
            value={address}
            size={208}
            level="H"
            fgColor="#0F1A16"
            bgColor="#FFFFFF"
            imageSettings={{ src: KOVA_MARK, height: 40, width: 40, excavate: true }}
            title={`QR code for your ${network.name} address`}
          />
        </div>
        {/* select-all: one tap selects the whole address, handy if copying is blocked */}
        <p className="text-small text-center font-semibold break-all select-all">{address}</p>
        {copyState === 'failed' && (
          <p role="alert" className="text-caption text-negative text-center">
            Couldn’t copy automatically. Tap the address above to select it, then copy.
          </p>
        )}
      </section>

      <div className="flex gap-3">
        <Button variant="secondary" icon={copyState === 'copied' ? 'check' : 'copy'} onClick={copy}>
          {copyState === 'copied' ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="secondary" icon="share" onClick={share}>
          Share
        </Button>
      </div>

      <NoticeCard tone="warning">
        Only send {coin?.name ?? 'this coin'} ({symbol}) on the {network.name} network to this
        address. Other coins sent here may be lost.
      </NoticeCard>

      <AssetPickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedId={coinId}
        onSelect={(id) => setParams({ coin: id }, { replace: true })}
        title="Receive which coin?"
      />
    </Screen>
  )
}
