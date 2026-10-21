import type { AlertSeverity, StatusTagType } from '../../types/oven'

/** Visuals per alert severity (Figma alert banner + "Tutti gli avvisi" sheet). */
export const SEVERITY: Record<
  AlertSeverity,
  {
    tag: StatusTagType | null
    surface: string
    badge: string
    icon: string
    icon16: string
    /** Dot on the "+N altri avvisi" row when this is the most severe alert. */
    dot: string
    srLabel: string
  }
> = {
  critical: {
    tag: 'critical',
    surface: 'bg-alarm-16',
    badge: 'bg-alarm',
    icon: 'sheet-error',
    icon16: 'tag-error',
    dot: 'dot-red',
    srLabel: 'Critical',
  },
  warning: {
    tag: 'warning',
    surface: 'bg-warning-16',
    badge: 'bg-yellow-400',
    icon: 'sheet-warning',
    icon16: 'sheet-warning-16',
    dot: 'dot-yellow',
    srLabel: 'Warning',
  },
  info: {
    tag: null,
    surface: 'bg-bg-secondary',
    badge: 'bg-bg-tertiary',
    icon: 'sheet-info',
    icon16: 'sheet-info-16',
    dot: 'dot-blue',
    srLabel: 'Information',
  },
}

const ORDER: AlertSeverity[] = ['critical', 'warning', 'info']

export function sortBySeverity<T extends { severity: AlertSeverity }>(alerts: T[]): T[] {
  return [...alerts].sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity))
}
