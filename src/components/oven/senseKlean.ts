import type { DirtLevel } from '../../types/oven'

/** Thresholds from the chart legend: Pulito 0–50, Sporco 51–75, Molto Sporco 76–100. */
export function dirtLevelOf(value: number): DirtLevel {
  if (value <= 50) return 'clean'
  if (value <= 75) return 'dirty'
  return 'veryDirty'
}

/**
 * Header styling per level (Figma "Card · SENSE.Klean"): Pulito is primary text with no icon,
 * Sporco a yellow warning, Molto Sporco the red `error` glyph in alarm red.
 */
export const DIRT_LEVEL: Record<DirtLevel, { label: string; text: string; icon: string | null; icon20: string | null }> = {
  clean: { label: 'Pulito', text: 'text-content-primary', icon: null, icon20: null },
  dirty: { label: 'Sporco', text: 'text-yellow-500', icon: 'dirt-warning-32', icon20: 'dirt-warning-20' },
  veryDirty: { label: 'Molto Sporco', text: 'text-alarm', icon: 'dirt-error-32', icon20: 'dirt-error-20' },
}

/**
 * "Oggi/Ieri alle HH:00" for an hourly reading. The series ends at the current
 * reading, so every bar before the last midnight belongs to yesterday.
 */
export function readingTimeLabel(hours: string[], index: number): string {
  const midnight = hours.lastIndexOf('00:00')
  const day = midnight !== -1 && index < midnight ? 'Ieri' : 'Oggi'
  return `${day} alle ${hours[index]}`
}

export const DIRT_LEGEND = [
  { label: 'Pulito', range: '0% - 50%' },
  { label: 'Sporco', range: '51% - 75%' },
  { label: 'Molto Sporco', range: '76% - 100%' },
]
