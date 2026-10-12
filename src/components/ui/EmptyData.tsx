import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

interface EmptyDataProps {
  /** Placeholder layout (axes, legend, rows) shown faded behind the message. */
  children: ReactNode
  /** Figma fades charts to 30% and the usage rows to 20%. */
  fade?: 'chart' | 'rows'
  className?: string
}

export const EMPTY_DATA_MESSAGE = 'Nessun dato ancora disponibile'

/**
 * Figma "empty-message": the card's normal layout, faded and hidden from assistive tech
 * (decorative, so exempt from contrast), with the message centred on top.
 */
export function EmptyData({ children, fade = 'chart', className }: EmptyDataProps) {
  return (
    <div className={cx('relative', className)}>
      <div aria-hidden="true" className={cx('pointer-events-none', fade === 'chart' ? 'opacity-30' : 'opacity-20')}>
        {children}
      </div>
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/8 px-4 py-1 type-label-lg whitespace-nowrap text-content-primary backdrop-blur-[40px]">
        {EMPTY_DATA_MESSAGE}
      </p>
    </div>
  )
}
