export function Avatar({ initials }: { initials: string }) {
  return (
    <button
      type="button"
      aria-label="Profilo utente"
      className="state-layer flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-200 type-label-xs text-blue-600"
    >
      <span aria-hidden="true">{initials}</span>
    </button>
  )
}
