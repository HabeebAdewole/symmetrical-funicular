import { useEffect, useRef, type ReactNode } from 'react'

type BottomSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Slide-up panel, the mobile version of a modal.
 * Built on the native <dialog> element, which gives us for free: focus trapping,
 * Esc to close, the backdrop, and screen-reader "dialog" semantics.
 */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)

  // Keep the real <dialog> in sync with the `open` prop
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="sheet-title"
      onClose={onClose}
      // A click directly on the <dialog> (not its content) means the backdrop was tapped
      onClick={(e) => e.target === ref.current && onClose()}
      className="animate-sheet-up bg-surface text-text m-0 mx-auto mt-auto w-full max-w-[430px] rounded-t-xl p-0 text-left backdrop:bg-black/50"
    >
      <div className="flex flex-col gap-4 px-5 pt-3 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        {/* Grab handle */}
        <span aria-hidden="true" className="bg-border mx-auto h-1 w-10 rounded-full" />
        <h2 id="sheet-title" className="text-h2 font-bold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  )
}
