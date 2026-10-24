import type { DirtLevel, StatusTagType } from '../../types/oven'

/** Thresholds from the chart legend: Pulito 0–50, Sporco 51–75, Molto Sporco 76–100. */
export function dirtLevelOf(value: number): DirtLevel {
  if (value <= 50) return 'clean'
  if (value <= 75) return 'dirty'
  return 'veryDirty'
}

/**
 * Status per level, shown after the value with the same Warning / Critical tags as the alerts:
 * Clean has no tag, Dirty is Warning, Very dirty is Critical. The icon is a grease drop that fills up with the level.
 */
export const DIRT_LEVEL: Record<DirtLevel, { label: string; tag: StatusTagType | null; icon: string }> = {
  clean: { label: 'Clean', tag: null, icon: 'dirt-level-clean' },
  dirty: { label: 'Dirty', tag: 'warning', icon: 'dirt-level-dirty' },
  veryDirty: { label: 'Very dirty', tag: 'critical', icon: 'dirt-level-very-dirty' },
}

/**
 * "Oggi/Ieri alle HH:00" for an hourly reading. The series ends at the current
 * reading, so every bar before the last midnight belongs to yesterday.
 */
export function readingTimeLabel(hours: string[], index: number): string {
  const midnight = hours.lastIndexOf('00:00')
  const day = midnight !== -1 && index < midnight ? 'Yesterday' : 'Today'
  return `${day} at ${hours[index]}`
}

export const DIRT_LEGEND = [
  { label: 'Clean', range: '0% - 50%' },
  { label: 'Dirty', range: '51% - 75%' },
  { label: 'Very dirty', range: '76% - 100%' },
]
