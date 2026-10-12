import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon } from './Icon'

interface LabelValueProps {
  label: string
  value: ReactNode
  /** Optional 20px leading icon (e.g. timelapse, temperature). */
  icon?: string
  className?: string
}

/** Small label (paragraph/xsmall) above a value (label/medium). */
export function LabelValue({ label, value, icon, className }: LabelValueProps) {
  return (
    <div className={cx('flex items-center gap-2', className)}>
      {icon && <Icon name={icon} size={20} />}
      <dl className="flex min-w-0 flex-col gap-1">
        <dt className="type-paragraph-xs text-content-quaternary">{label}</dt>
        <dd className="type-label-md text-content-primary">{value}</dd>
      </dl>
    </div>
  )
}
