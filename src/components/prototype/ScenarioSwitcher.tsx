import { useId, useState } from 'react'
import type { Scenario } from '../../types/oven'

interface ScenarioSwitcherProps {
  scenarios: Scenario[]
  activeId: string
  onSelect: (id: string) => void
  onReset: () => void
}

/**
 * Prototype-only control (not part of the design): picks the mock scenario and
 * restarts the live simulation. Deliberately styled apart from the DDC UI.
 */
export function ScenarioSwitcher({ scenarios, activeId, onSelect, onReset }: ScenarioSwitcherProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const selectId = useId()

  return (
    <aside
      aria-label="Strumento prototipo"
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
        className="flex items-center gap-2 rounded-full border border-white/20 bg-grey-400/90 px-3 py-1.5 text-white shadow-elevation-1 backdrop-blur hover:bg-grey-400"
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-magenta-300" />
        Prototipo · {activeId}
      </button>
    </aside>
  )
}
