import { cx } from '@/lib/cx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

// Figma: Button (Style=Primary|Secondary|Ghost, State=Default|Disabled)
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-surface-raised text-text',
  ghost: 'text-primary',
  // Destructive actions (reset wallet). Same red in both themes.
  danger: 'bg-negative text-white',
}

/**
 * Shared classes so a <Link> can look exactly like a <Button>:
 * <Link to="/send" className={buttonStyles('primary')}>Send</Link>
 */
export function buttonStyles(variant: ButtonVariant = 'primary', fullWidth = true) {
  return cx(
    'inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-body font-bold',
    'transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    fullWidth && 'w-full',
    variants[variant],
  )
}
