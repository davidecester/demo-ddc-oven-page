export function Avatar({ initials }: { initials: string }) {
  return (
    <button
      type="button"
      // Accessible name starts with the visible initials (WCAG 2.5.3 Label in Name)
      aria-label={`${initials}, profilo utente`}
      className="state-layer flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-200 type-label-xs text-blue-600"
    >
      {initials}
    </button>
  )
}
