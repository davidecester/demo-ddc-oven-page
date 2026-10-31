import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

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
  const scrollPending = useRef(false)

  // Start the newly opened page at the top: jump once it has rendered (before paint), and skip the global smooth
  // scroll, which would otherwise animate across the old page while it is swapped out and can stop part-way
  useLayoutEffect(() => {
    if (!scrollPending.current) return
    scrollPending.current = false
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [view])

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
    scrollPending.current = true
    setView(id)
  }, [])

  return { view, openView }
}
