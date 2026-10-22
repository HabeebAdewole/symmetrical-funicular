import { Icon } from '@/components/icons/Icon'

type TopBarProps = {
  title?: string
  /** Shows the round back button when provided */
  onBack?: () => void
}

/** Screen header: back button, centred title, and an invisible spacer that keeps the title centred. */
export function TopBar({ title, onBack }: TopBarProps) {
  return (
    <header className="flex h-14 items-center px-5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="bg-surface flex size-10 items-center justify-center rounded-full active:scale-95"
        >
          <Icon name="chevron-left" />
        </button>
      ) : (
        <span className="size-10" />
      )}
      <h1 className="text-body flex-1 text-center font-semibold">{title}</h1>
      <span className="size-10" />
    </header>
  )
}
