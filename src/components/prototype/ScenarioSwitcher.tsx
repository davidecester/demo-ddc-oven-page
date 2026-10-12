import { useEffect, useId, useRef, useState } from 'react'
import type { Scenario } from '../../types/oven'

interface ScenarioSwitcherProps {
  scenarios: Scenario[]
  activeId: string
  onSelect: (id: string) => void
  onReset: () => void
}

/** How long the full pill (dot + label) stays visible, pulsing, after the page loads. */
const INTRO_MS = 6000

/**
 * Prototype-only control (not part of the design): picks the mock scenario and
 * restarts the live simulation. Deliberately styled apart from the DDC UI.
 * After a short pulsing intro it shrinks to just the dot, so it covers less of the page;
 * hover, keyboard focus or an open panel grow it back to dot + label.
 */
export function ScenarioSwitcher({ scenarios, activeId, onSelect, onReset }: ScenarioSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [intro, setIntro] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const panelId = useId()
  const selectId = useId()
  const expanded = intro || hovered || focused || open

  useEffect(() => {
    const id = window.setTimeout(() => setIntro(false), INTRO_MS)
    return () => window.clearTimeout(id)
  }, [])

  // A tap or click outside closes the panel (touch has no hover-out to shrink it back)
  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  return (
    <aside
      ref={rootRef}
      aria-label="Strumento prototipo"
      // Hover only for mouse/pen, so a tap doesn't leave the pill stuck open on touch screens
      onPointerEnter={(e) => e.pointerType !== 'touch' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => setFocused(e.target.matches(':focus-visible'))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
      className="fixed bottom-[calc(var(--spacing-bottom-nav)+12px+env(safe-area-inset-bottom))] left-3 z-30 font-mono text-[12px] lg:bottom-4 lg:left-[calc(var(--spacing-sidebar)+16px)]"
    >
      {open && (
        <div
          id={panelId}
          className="mb-2 flex w-64 flex-col gap-3 rounded-md border border-white/20 bg-grey-400/95 p-3 text-white shadow-elevation-1 backdrop-blur"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor={selectId} className="text-white/70">
              Scenario
            </label>
            <select
              id={selectId}
              value={activeId}
              onChange={(e) => onSelect(e.target.value)}
              className="rounded-sm border border-white/30 bg-grey-400 px-2 py-1.5 text-white"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-sm border border-white/30 px-2 py-1.5 text-left hover:bg-white/10"
          >
            ↺ Riavvia simulazione
          </button>
          <p className="text-white/60">
            Link condivisibile: <span className="break-all text-white/80">?scenario={activeId}</span>
          </p>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center rounded-full border border-white/20 bg-grey-400/90 px-[11px] py-1.5 text-white shadow-elevation-1 backdrop-blur hover:bg-grey-400 ${
          intro ? 'switcher-pulse' : ''
        }`}
      >
        {/* Same 1.4 s beat as the pill, so dot and pill grow and shrink together */}
        <span
          aria-hidden="true"
          className={`size-2 shrink-0 rounded-full bg-magenta-300 ${intro ? 'switcher-dot-pulse' : ''}`}
        />
        {/* Stays in the accessible name when visually collapsed */}
        <span
          className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-out ${
            expanded ? 'ml-2 max-w-[240px] opacity-100' : 'ml-0 max-w-0 opacity-0'
          }`}
        >
          Prototipo · {activeId}
        </span>
      </button>
    </aside>
  )
}
