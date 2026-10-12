import { useEffect } from 'react'

const DURATION_MS = 4000

interface ToastProps {
  /** Message to show; `null` hides the toast. */
  message: string | null
  onDismiss: () => void
}

/**
 * Short confirmation shown above the bottom nav and the prototype switcher (mobile) or at the bottom of the content (desktop).
 * Prototype feedback for actions that have no screen of their own; not part of the Figma file.
 * Announced politely; hides itself after 4 s.
 */
export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(onDismiss, DURATION_MS)
    return () => window.clearTimeout(id)
  }, [message, onDismiss])

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-4 bottom-[calc(var(--spacing-bottom-nav)+56px+env(safe-area-inset-bottom))] z-40 flex justify-center lg:bottom-6 lg:left-(--spacing-sidebar)"
    >
      {message && (
        <p className="toast-in rounded-md bg-grey-400 px-4 py-3 text-center type-paragraph-md text-white shadow-elevation-1">
          {message}
        </p>
      )}
    </div>
  )
}
