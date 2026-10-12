import type { DirtLevel } from '../../types/oven'

/** Thresholds from the chart legend: Pulito 0–50, Sporco 51–75, Molto Sporco 76–100. */
export function dirtLevelOf(value: number): DirtLevel {
  if (value <= 50) return 'clean'
  if (value <= 75) return 'dirty'
  return 'veryDirty'
}

/**
 * Header styling per level. Only `dirty` is defined in Figma so far;
 * `clean` and `veryDirty` are placeholders until scenario 3 frames arrive.
 */
export const DIRT_LEVEL: Record<DirtLevel, { label: string; text: string; icon: string; icon20: string }> = {
  clean: { label: 'Pulito', text: 'text-green-text', icon: 'check-circle', icon20: 'check-circle' },
  dirty: { label: 'Sporco', text: 'text-yellow-500', icon: 'dirt-warning-32', icon20: 'dirt-warning-20' },
  veryDirty: { label: 'Molto Sporco', text: 'text-red-500', icon: 'tag-error-outline', icon20: 'tag-error-outline' },
}

export const DIRT_LEGEND = [
  { label: 'Pulito', range: '0% - 50%' },
  { label: 'Sporco', range: '51% - 75%' },
  { label: 'Molto Sporco', range: '76% - 100%' },
]
