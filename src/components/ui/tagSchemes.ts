import type { StatusTagType } from '../../types/oven'

export interface TagScheme {
  icon: string
  label: string
  surface: string
  text: string
}

/**
 * Colour schemes shared by the read-only Status Tag and the clickable Chip, so a colour
 * change (e.g. for contrast) lands on both. Labels are the Figma component defaults.
 */
export const TAG_SCHEMES: Record<StatusTagType, TagScheme> = {
  cooking: { icon: 'tag-fire', label: 'Cooking in progress', surface: 'bg-orange-100', text: 'text-content-secondary' },
  washing: { icon: 'tag-washing', label: 'Washing in progress', surface: 'bg-blue-100', text: 'text-content-secondary' },
  idle: { icon: 'tag-standby', label: 'Idle', surface: 'bg-grey-200', text: 'text-content-secondary' },
  filterGood: { icon: 'tag-water-good', label: 'Filter OK', surface: 'bg-green-100', text: 'text-content-secondary' },
  filterExhausted: { icon: 'tag-water-exhausted', label: 'Replace filter', surface: 'bg-red-100', text: 'text-content-secondary' },
  offline: { icon: 'tag-wifi-off', label: 'Oven offline', surface: 'bg-alarm', text: 'text-white' },
  maintenance: { icon: 'tag-error-outline', label: 'Maintenance required', surface: 'bg-red-100', text: 'text-content-secondary' },
  critical: { icon: 'tag-error', label: 'Critical', surface: 'bg-alarm', text: 'text-white' },
  warning: { icon: 'tag-warning', label: 'Warning', surface: 'bg-yellow-400', text: 'text-black' },
  alertCount: { icon: 'tag-bell-info', label: '', surface: 'bg-blue-100', text: 'text-content-secondary' },
}

/** Icon, then the optional count and the label 2px apart (Figma "Number-Notification"). */
export const TAG_BASE = 'inline-flex shrink-0 items-center gap-1 border border-black/5 backdrop-blur-[15px]'
