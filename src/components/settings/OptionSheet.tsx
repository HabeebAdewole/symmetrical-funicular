import { Icon } from '@/components/icons/Icon'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { cx } from '@/lib/cx'

type OptionSheetProps<T extends string | number> = {
  open: boolean
  onClose: () => void
  title: string
  options: { value: T; label: string; hint?: string }[]
  value: T
  onSelect: (value: T) => void
}

/** "Pick one" list in a bottom sheet (currency, theme, auto-lock). Closes after choosing. */
export function OptionSheet<T extends string | number>({
  open,
  onClose,
  title,
  options,
  value,
  onSelect,
}: OptionSheetProps<T>) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div role="radiogroup" aria-label={title} className="-mx-2 flex flex-col">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                onSelect(option.value)
                onClose()
              }}
              className={cx(
                'flex items-center gap-3 rounded-md px-3 py-3 text-left',
                selected ? 'bg-surface-raised' : 'active:bg-surface-raised',
              )}
            >
              <span className="flex flex-1 flex-col">
                <span className="font-semibold">{option.label}</span>
                {option.hint && <span className="text-caption text-text-muted">{option.hint}</span>}
              </span>
              {selected && <Icon name="check" size={20} className="text-primary" />}
            </button>
          )
        })}
      </div>
    </BottomSheet>
  )
}
