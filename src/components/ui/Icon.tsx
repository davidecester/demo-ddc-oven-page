import type { CSSProperties } from 'react'
import { iconUrl } from '../../utils/assets'
import { cx } from '../../utils/cx'

interface IconProps {
  /** File name in public/assets/icons, without extension. */
  name: string
  /** Rendered box size in px (Figma slot size). */
  size: number
  className?: string
  /**
   * Tint a single-colour icon with currentColor instead of its baked-in fill.
   * Used where the icon colour follows an interactive state (tabs, nav).
   */
  tint?: boolean
}

/** Decorative icon: always hidden from assistive tech; pair it with visible text or an aria-label. */
export function Icon({ name, size, className, tint = false }: IconProps) {
  const url = iconUrl(name)

  if (tint) {
    const style: CSSProperties = {
      width: size,
      height: size,
      maskImage: `url("${url}")`,
      WebkitMaskImage: `url("${url}")`,
    }
    return <span aria-hidden="true" className={cx('mask-icon', className)} style={style} />
  }

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cx('block shrink-0', className)}
      style={{ width: size, height: size }}
      draggable={false}
    />
  )
}
