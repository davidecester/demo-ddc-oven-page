import { useCallback, useEffect, useState } from 'react'
import { defaultScenarioId } from '../data/scenarios'

const PARAM = 'scenario'

function readParam(): string {
  return new URLSearchParams(window.location.search).get(PARAM) ?? defaultScenarioId
}

/** Keeps the active scenario in sync with `?scenario=<id>` so states can be shared by link. */
export function useScenarioParam() {
  const [scenarioId, setScenarioId] = useState(readParam)

  useEffect(() => {
    const onPop = () => setScenarioId(readParam())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const selectScenario = useCallback((id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM, id)
    window.history.pushState(null, '', url)
    setScenarioId(id)
  }, [])

  return { scenarioId, selectScenario }
}
