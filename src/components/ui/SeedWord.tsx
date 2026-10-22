import { cx } from '@/lib/cx'

type SeedWordProps = {
  /** Position in the phrase (1–12). Omit to hide the number (e.g. word choices). */
  number?: number
  word?: string
  /** Figma: State=Default | Selected | Empty */
  state?: 'default' | 'selected' | 'empty'
  /** Makes the chip a button (Confirm seed screen) */
  onClick?: () => void
  disabled?: boolean
}

/** One recovery word chip. Three fit across a phone screen. */
export function SeedWord({ number, word, state = 'default', onClick, disabled }: SeedWordProps) {
  const className = cx(
    'flex h-12 items-center gap-2 rounded-md px-3 text-left',
    state === 'default' && 'bg-surface-raised text-text',
    state === 'selected' && 'bg-primary text-on-primary',
    state === 'empty' && 'border-[1.5px] border-dashed border-border text-text-muted',
    onClick && 'transition-transform active:scale-95 disabled:opacity-35',
  )
  const content = (
    <>
      {number !== undefined && (
        <span
          className={cx('numeric text-caption', state === 'default' && 'text-text-muted')}
          aria-hidden={!word}
        >
          {number}
        </span>
      )}
      {word && <span className="font-semibold">{word}</span>}
    </>
  )

  return onClick ? (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  )
}
