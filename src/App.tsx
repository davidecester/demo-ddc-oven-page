import { useState } from 'react'
import { BottomNav } from './components/layout/BottomNav'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { ScenarioSwitcher } from './components/prototype/ScenarioSwitcher'
import { findScenario, scenarios } from './data/scenarios'
import { useScenarioParam } from './hooks/useScenarioParam'
import { OvenPage } from './pages/OvenPage'

export default function App() {
  const { scenarioId, selectScenario } = useScenarioParam()
  const scenario = findScenario(scenarioId)
  // Bumping the run counter remounts the page and restarts the live simulation
  const [run, setRun] = useState(0)

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-bg-primary px-4 py-2 type-label-sm text-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar ovenName={scenario.oven.name} />
        <OvenPage key={`${scenario.id}-${run}`} scenario={scenario} />
      </div>
      <BottomNav />
      <ScenarioSwitcher
        scenarios={scenarios}
        activeId={scenario.id}
        onSelect={selectScenario}
        onReset={() => setRun((r) => r + 1)}
      />
    </div>
  )
}
