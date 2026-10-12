import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query (used where layout differs beyond CSS, e.g. chart density). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const TABLET_UP = '(min-width: 768px)'
