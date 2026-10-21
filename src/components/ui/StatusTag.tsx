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
  cooking: { icon: 'tag-fire', label: 'Cottura in corso', surface: 'bg-orange-100', text: 'text-content-secondary' },
  washing: { icon: 'tag-washing', label: 'Lavaggio in corso', surface: 'bg-blue-100', text: 'text-content-secondary' },
  idle: { icon: 'tag-standby', label: 'In attesa', surface: 'bg-grey-200', text: 'text-content-secondary' },
  filterGood: { icon: 'tag-water-good', label: 'Filtro buono', surface: 'bg-green-100', text: 'text-content-secondary' },
  filterExhausted: { icon: 'tag-water-exhausted', label: 'Sostituire filtro', surface: 'bg-red-100', text: 'text-content-secondary' },
  offline: { icon: 'tag-wifi-off', label: 'Forno offline', surface: 'bg-red-100', text: 'text-content-secondary' },
  maintenance: { icon: 'tag-error-outline', label: 'Manutenzione richiesta', surface: 'bg-red-100', text: 'text-content-secondary' },
  critical: { icon: 'tag-error', label: 'Critico', surface: 'bg-alarm', text: 'text-white' },
  warning: { icon: 'tag-warning', label: 'Attenzione', surface: 'bg-yellow-400', text: 'text-black' },
  alertCount: { icon: 'tag-bell-info', label: '', surface: 'bg-blue-100', text: 'text-content-secondary' },
  alertCritical: { icon: 'tag-error-outline', label: 'Critico', surface: 'bg-red-100', text: 'text-content-secondary' },
  // Icon in yellow-500 (#ad8205): 3.17:1 on yellow-100 (WCAG 1.4.11)
  alertWarning: { icon: 'tag-warning-yellow', label: 'Attenzione', surface: 'bg-yellow-100', text: 'text-content-secondary' },
}

// Figma strokes sit inside the box, so each padding is the Figma value minus the 1px border
const SIZES = {
  // S: 24px, Figma padding 4/8
  sm: 'h-6 rounded-lg px-[7px] py-[3px]',
  // M: the overview tags, one step up in hierarchy (28px pill, Figma padding 6/12)
  md: 'h-7 rounded-full px-[11px] py-[5px]',
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
        SIZES[size],
        style.surface,
        className,
      )}
    >
      <Icon name={style.icon} size={16} />
      <span className={cx('type-label-xs flex gap-[2px] whitespace-nowrap', style.text)}>
        {count !== undefined && <span>{count}</span>}
        {(label ?? style.label) && <span>{label ?? style.label}</span>}
      </span>
    </span>
  )
}
