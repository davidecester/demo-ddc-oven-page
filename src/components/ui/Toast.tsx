import { useEffect } from 'react'
import { Icon } from './Icon'

const DURATION_MS = 4000

interface ToastProps {
  /** Message to show; `null` hides the toast. */
  message: string | null
  onDismiss: () => void
}

/**
 * Short confirmation shown above the bottom nav and the prototype switcher (mobile) or at the bottom of the content (desktop).
 * Prototype feedback for actions that have no screen of their own; matches the Figma Toast component.
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
        <p className="toast-in flex items-start gap-2 rounded-md bg-content-primary px-4 py-2 type-paragraph-md text-white shadow-elevation-2">
          <Icon name="check-circle-positive" size={20} />
          {/* 1px down so the first 18px line centres on the 20px icon when the message wraps */}
          <span className="pt-px">{message}</span>
        </p>
      )}
    </div>
  )
}
