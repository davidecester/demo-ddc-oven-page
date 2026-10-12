import { useEffect, useRef, type ReactNode } from 'react'
import { IconButton } from './Button'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  titleId: string
  children: ReactNode
}

/**
 * Modal bottom sheet built on <dialog>: the browser provides focus trapping,
 * Esc to close and an inert background. A click on the scrim also closes it.
 * On desktop it spans the content area only (the sidebar stays visible).
 */
export function BottomSheet({ open, onClose, title, titleId, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // Clicks on the dialog element itself land on the ::backdrop area
        if (e.target === e.currentTarget) onClose()
      }}
      className="sheet fixed inset-x-0 top-auto bottom-0 m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-lg bg-bg-primary p-0 shadow-sheet lg:left-(--spacing-sidebar) lg:w-[calc(100%-var(--spacing-sidebar))]"
    >
      <div className="flex flex-col gap-9 p-4 pb-[calc(16px+env(safe-area-inset-bottom))] md:p-6">
        <div className="relative flex items-center justify-between pr-10">
          <h2 id={titleId} className="type-heading-xs text-content-primary">
            {title}
          </h2>
          <IconButton
            icon="close"
            iconSize={24}
            boxSize={40}
            label="Chiudi"
            onClick={onClose}
            className="absolute -top-2 -right-2"
          />
        </div>
        {children}
      </div>
    </dialog>
  )
}
