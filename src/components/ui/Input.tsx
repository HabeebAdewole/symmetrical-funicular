import { useId, type InputHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  helper?: string
  /** When set, the field turns red and this replaces the helper text */
  error?: string
}

/** Labelled 56px text field. Figma: Input (State=Default|Focus|Error); focus is handled by CSS. */
export function Input({ label, helper, error, className, id, ...props }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`
  const message = error ?? helper

  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-small font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cx(
          'bg-surface text-body text-text placeholder:text-text-muted h-14 w-full rounded-md px-4 outline-none',
          'border transition-colors focus:border-2',
          error ? 'border-negative border-2' : 'border-border focus:border-primary',
        )}
        {...props}
      />
      {message && (
        <p
          id={messageId}
          className={cx('text-caption', error ? 'text-negative' : 'text-text-muted')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
