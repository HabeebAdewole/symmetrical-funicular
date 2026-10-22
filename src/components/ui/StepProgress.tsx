import { cx } from '@/lib/cx'

/** Onboarding progress bar: 1 Create · 2 Show phrase · 3 Confirm · 4 PIN */
export function StepProgress({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
      className="flex w-30 gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cx('h-1.5 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-border')}
        />
      ))}
    </div>
  )
}
