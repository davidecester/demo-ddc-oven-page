import type { StatusTagType } from '../../types/oven'
import { cx } from '../../utils/cx'
import { Icon } from './Icon'

interface TagStyle {
  icon: string
  label: string
  surface: string
  text: string
}

/** Variants of the Figma "Status Tag" component set (labels are the component defaults). */
const TAG_STYLES: Record<StatusTagType, TagStyle> = {
  cooking: { icon: 'tag-fire', label: 'Cooking in progress', surface: 'bg-orange-100', text: 'text-content-secondary' },
  washing: { icon: 'tag-washing', label: 'Washing in progress', surface: 'bg-blue-100', text: 'text-content-secondary' },
  idle: { icon: 'tag-standby', label: 'Idle', surface: 'bg-grey-200', text: 'text-content-secondary' },
  filterGood: { icon: 'tag-water-good', label: 'Filter OK', surface: 'bg-green-100', text: 'text-content-secondary' },
  filterExhausted: { icon: 'tag-water-exhausted', label: 'Replace filter', surface: 'bg-red-100', text: 'text-content-secondary' },
  offline: { icon: 'tag-wifi-off', label: 'Oven offline', surface: 'bg-red-100', text: 'text-content-secondary' },
  maintenance: { icon: 'tag-error-outline', label: 'Maintenance required', surface: 'bg-red-100', text: 'text-content-secondary' },
  critical: { icon: 'tag-error', label: 'Critical', surface: 'bg-alarm', text: 'text-white' },
  warning: { icon: 'tag-warning', label: 'Warning', surface: 'bg-yellow-400', text: 'text-black' },
  alertCount: { icon: 'tag-bell-info', label: '', surface: 'bg-blue-100', text: 'text-content-secondary' },
}

// Figma strokes sit inside the box, so each padding is the Figma value minus the 1px border
const SIZES = {
  // S: 24px, Figma padding 4/8. Read-only status, so a 4px radius instead of a pill.
  sm: { box: 'h-6 rounded-sm px-[7px] py-[3px]', text: 'type-label-xs' },
  // M: the overview chips, clickable (28px pill, Figma padding 6/12, 14px label)
  md: { box: 'h-7 rounded-full px-[11px] py-[5px]', text: 'type-label-sm' },
} as const

interface StatusTagProps {
  type: StatusTagType
  /** Overrides the default label (e.g. "Cottura" in the activity card header). */
  label?: string
  /** Number shown before the label, 2px apart (Figma "Number-Notification"). */
  count?: number
  size?: keyof typeof SIZES
  className?: string
}

export function StatusTag({ type, label, count, size = 'sm', className }: StatusTagProps) {
  const style = TAG_STYLES[type]
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1 border border-black/5 backdrop-blur-[15px]',
        SIZES[size].box,
        style.surface,
        className,
      )}
    >
      <Icon name={style.icon} size={16} />
      <span className={cx(SIZES[size].text, 'flex gap-[2px] whitespace-nowrap', style.text)}>
        {count !== undefined && <span>{count}</span>}
        {(label ?? style.label) && <span>{label ?? style.label}</span>}
      </span>
    </span>
  )
}
