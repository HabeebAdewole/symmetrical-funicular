import { Icon } from '@/components/icons/Icon'
import { haptics } from '@/lib/haptics'

type PinKeypadProps = {
  onDigit: (digit: string) => void
  onBackspace: () => void
  disabled?: boolean
}

const keyClass =
  'flex h-16 items-center justify-center rounded-full text-h1 font-bold transition-colors active:bg-surface-raised disabled:opacity-40'

/** 3×4 number pad. The empty bottom-left cell keeps 0 centred, like a phone dialler. */
export function PinKeypad({ onDigit, onBackspace, disabled }: PinKeypadProps) {
  // A tiny buzz on every key press (Android), like a native keypad
  const press = (digit: string) => {
    haptics.tap()
    onDigit(digit)
  }
  const remove = () => {
    haptics.tap()
    onBackspace()
  }

  return (
    <div className="grid w-full grid-cols-3 gap-x-6 gap-y-3">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          className={keyClass}
          disabled={disabled}
          onClick={() => press(digit)}
        >
          {digit}
        </button>
      ))}
      <span aria-hidden="true" />
      <button type="button" className={keyClass} disabled={disabled} onClick={() => press('0')}>
        0
      </button>
      <button
        type="button"
        className={keyClass}
        disabled={disabled}
        onClick={remove}
        aria-label="Delete last digit"
      >
        <Icon name="backspace" />
      </button>
    </div>
  )
}
