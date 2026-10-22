import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { AmountStep } from '@/components/send/AmountStep'
import { RecipientStep } from '@/components/send/RecipientStep'
import { ReviewStep } from '@/components/send/ReviewStep'
import { SuccessStep } from '@/components/send/SuccessStep'
import { PinConfirmSheet } from '@/components/wallet/PinConfirmSheet'
import { useMarketCoin, useMarkets } from '@/hooks/useMarkets'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { haptics } from '@/lib/haptics'
import { feeInCoin, networkOf } from '@/lib/networks'
import { useWalletStore } from '@/store/walletStore'

type Step = 'recipient' | 'amount' | 'review' | 'success'

const randomHex = (bytes: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')

/**
 * Send flow (Figma Send 1–4). One route, four steps: the page keeps the draft (coin, address, amount)
 * so going back and forth between steps never loses what you typed.
 */
export default function SendPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const holdings = useWalletStore((s) => s.holdings)
  const currency = useWalletStore((s) => s.currency)
  const addTransaction = useWalletStore((s) => s.addTransaction)

  // Start with ?coin=… if given and owned, otherwise your biggest holding
  const [coinId, setCoinId] = useState(() => {
    const wanted = params.get('coin')
    return wanted && holdings.some((h) => h.coinId === wanted)
      ? wanted
      : (holdings[0]?.coinId ?? 'bitcoin')
  })
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState(0)
  const [step, setStep] = useState<Step>('recipient')
  const [pinOpen, setPinOpen] = useState(false)
  const [txId, setTxId] = useState('')

  const { coin } = useMarketCoin(coinId)
  const markets = useMarkets()
  const ownAddress = useWalletAddress(coinId)
  const network = networkOf(coinId)

  const price = coin?.current_price ?? 0
  // Mock transactions are stored in USD; USDC's price in your currency is the USD exchange rate
  const usdRate = markets.data?.coins.find((c) => c.id === 'usd-coin')?.current_price ?? 1
  const usdPrice = price / usdRate
  const fee = feeInCoin(coinId, usdPrice)
  const balance = holdings.find((h) => h.coinId === coinId)?.amount ?? 0
  const symbol = coin?.symbol.toUpperCase() ?? ''

  const send = () => {
    const id = `tx_${randomHex(5)}`
    addTransaction({
      id,
      type: 'send',
      coinId,
      amount,
      fee,
      valueUsd: amount * usdPrice,
      counterparty: to.trim(),
      status: 'pending', // the confirmation simulator flips this to completed after ~20s
      timestamp: Date.now(),
      hash: `0x${randomHex(32)}`,
    })
    haptics.success()
    setTxId(id)
    setPinOpen(false)
    setStep('success')
  }

  if (step === 'success') {
    return (
      <SuccessStep
        txId={txId}
        symbol={symbol}
        amount={amount}
        price={price}
        currency={currency}
        to={to.trim()}
        eta={network.eta}
      />
    )
  }

  if (step === 'amount') {
    return (
      <AmountStep
        symbol={symbol}
        coinName={coin?.name ?? ''}
        price={price}
        balance={balance}
        fee={fee}
        currency={currency}
        to={to.trim()}
        amount={amount}
        onAmountChange={setAmount}
        onBack={() => setStep('recipient')}
        onNext={() => setStep('review')}
      />
    )
  }

  if (step === 'review') {
    return (
      <>
        <ReviewStep
          image={coin?.image}
          symbol={symbol}
          networkName={network.name}
          eta={network.eta}
          amount={amount}
          fee={fee}
          price={price}
          currency={currency}
          to={to.trim()}
          onBack={() => setStep('amount')}
          onConfirm={() => setPinOpen(true)}
        />
        <PinConfirmSheet
          open={pinOpen}
          onClose={() => setPinOpen(false)}
          onConfirmed={send}
          title="Confirm send"
        />
      </>
    )
  }

  return (
    <RecipientStep
      coin={coin}
      coinId={coinId}
      balance={balance}
      ownAddress={ownAddress}
      to={to}
      onCoinChange={(id) => {
        setCoinId(id)
        setAmount(0) // an amount in BTC means nothing in ETH
      }}
      onToChange={setTo}
      onBack={() => navigate(-1)}
      onNext={() => setStep('amount')}
    />
  )
}
