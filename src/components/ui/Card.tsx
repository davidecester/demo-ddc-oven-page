import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

interface CardProps {
  /** Element id, e.g. the target of an in-page anchor. */
  id?: string
  /** Heading id, used to label the section landmark. */
  labelledBy?: string
  className?: string
  children: ReactNode
}

/** White surface card: 16px radius, elevation 1, 16px padding on mobile and 24px from tablet up. */
export function Card({ id, labelledBy, className, children }: CardProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // @container: card internals adapt to the card's own width, not the viewport
      className={cx('@container flex min-w-0 flex-col rounded-lg bg-bg-primary p-4 shadow-elevation-1 md:p-6', className)}
    >
      {children}
    </section>
  )
}

interface CardTitleProps {
  id: string
  children: ReactNode
  className?: string
}

export function CardTitle({ id, children, className }: CardTitleProps) {
  return (
    <h2 id={id} className={cx('type-heading-xs text-content-primary', className)}>
      {children}
    </h2>
  )
}
