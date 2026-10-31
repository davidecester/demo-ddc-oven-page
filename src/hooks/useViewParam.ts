import { useCallback, useEffect, useState } from 'react'

const PARAM = 'view'

export type ViewId = 'activity-trend'

function readParam(): ViewId | null {
  return new URLSearchParams(window.location.search).get(PARAM) === 'activity-trend' ? 'activity-trend' : null
}

/**
 * The sub-page shown instead of the oven page, kept in `?view=<id>` so the browser back button and shared links
 * work. `null` is the oven page itself.
 */
export function useViewParam() {
  const [view, setView] = useState(readParam)

  useEffect(() => {
    const onPop = () => setView(readParam())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openView = useCallback((id: ViewId | null) => {
    const url = new URL(window.location.href)
    if (id) url.searchParams.set(PARAM, id)
    else url.searchParams.delete(PARAM)
    window.history.pushState(null, '', url)
    setView(id)
    window.scrollTo({ top: 0 })
  }, [])

  return { view, openView }
}
