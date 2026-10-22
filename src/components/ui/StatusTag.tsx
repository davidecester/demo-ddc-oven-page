import type { StatusTagType } from '../../types/oven'
import { cx } from '../../utils/cx'
import { Icon } from './Icon'
import { TAG_BASE, TAG_SCHEMES } from './tagSchemes'

interface StatusTagProps {
  type: StatusTagType
  /** Overrides the default label (e.g. "Cottura" in the activity card header). */
  label?: string
  className?: string
}

/**
 * Figma "Status Tag": read-only status, 24px with a 4px radius (the pill shape is kept for the clickable Chip).
 * Figma strokes sit inside the box, so the padding is the Figma 4/8 minus the 1px border.
 */
export function StatusTag({ type, label, className }: StatusTagProps) {
  const scheme = TAG_SCHEMES[type]
  return (
    <span className={cx(TAG_BASE, 'h-6 rounded-sm px-[7px] py-[3px]', scheme.surface, className)}>
      <Icon name={scheme.icon} size={16} />
      <span className={cx('type-label-xs whitespace-nowrap', scheme.text)}>{label ?? scheme.label}</span>
    </span>
  )
}
