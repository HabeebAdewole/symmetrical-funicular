import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from '@/components/icons/Icon'
import { buttonStyles, type ButtonVariant } from '@/components/ui/buttonStyles'
import { cx } from '@/lib/cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: IconName
  fullWidth?: boolean
}

/** Pill button, 56px tall. One Primary per screen; Secondary for the alternative; Ghost for low emphasis. */
export function Button({
  variant = 'primary',
  icon,
  fullWidth = true,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cx(buttonStyles(variant, fullWidth), className)} {...props}>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  )
}
