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
  idle: { icon: 'tag-standby', label: 'In attesa', surface: 'bg-grey-100', text: 'text-content-secondary' },
  filterGood: { icon: 'tag-water-good', label: 'Filtro buono', surface: 'bg-green-100', text: 'text-content-secondary' },
  filterExhausted: { icon: 'tag-water-exhausted', label: 'Sostituire filtro', surface: 'bg-red-100', text: 'text-content-secondary' },
  offline: { icon: 'tag-wifi-off', label: 'Forno offline', surface: 'bg-red-100', text: 'text-content-secondary' },
  maintenance: { icon: 'tag-error-outline', label: 'Manutenzione richiesta', surface: 'bg-red-100', text: 'text-content-secondary' },
  critical: { icon: 'tag-error', label: 'Critico', surface: 'bg-alarm-strong', text: 'text-white' },
  warning: { icon: 'tag-warning', label: 'Attenzione', surface: 'bg-yellow-400', text: 'text-black' },
}

interface StatusTagProps {
  type: StatusTagType
  /** Overrides the default label (e.g. "Cottura" in the activity card header). */
  label?: string
  className?: string
}

export function StatusTag({ type, label, className }: StatusTagProps) {
  const style = TAG_STYLES[type]
  return (
    <span
      className={cx(
        // Figma strokes sit inside the 24px box: 1px border + 3px padding + 16px icon row
        'inline-flex h-6 shrink-0 items-center gap-1 rounded-lg border border-black/5 px-2 py-[3px] backdrop-blur-[15px]',
        style.surface,
        className,
      )}
    >
      <Icon name={style.icon} size={16} />
      <span className={cx('type-label-xs whitespace-nowrap', style.text)}>{label ?? style.label}</span>
    </span>
  )
}
