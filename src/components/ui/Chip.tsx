import type { StatusTagType } from '../../types/oven'
import { cx } from '../../utils/cx'
import { Icon } from './Icon'
import { TAG_BASE, TAG_SCHEMES } from './tagSchemes'

interface ChipProps {
  type: StatusTagType
  label?: string
  /** Number shown before the label, 2px apart (Figma "Number-Notification"). */
  count?: number
  /** In-page link; without it the chip is shown read-only (e.g. "Oven offline"). */
  href?: string
  /** Replaces the visible text for screen readers, e.g. "2 more alerts". */
  srText?: string
  /** Name of the card the link goes to, read after the text: "…: go to Alerts". */
  targetLabel?: string
  className?: string
}

/**
 * Figma "Chip": the overview tags. 28px pill, 14px label, same colour schemes as the Status Tag.
 * Clickable ones lift on hover and recess on press (state-lift) on top of the shared state layer.
 * Figma strokes sit inside the box, so the padding is the Figma 6/12 minus the 1px border.
 */
export function Chip({ type, label, count, href, srText, targetLabel, className }: ChipProps) {
  const scheme = TAG_SCHEMES[type]
  const text = label ?? scheme.label
  const body = (
    <>
      <Icon name={scheme.icon} size={16} />
      <span aria-hidden={srText ? true : undefined} className={cx('type-label-sm flex gap-[2px] whitespace-nowrap', scheme.text)}>
        {count !== undefined && <span>{count}</span>}
        {text && <span>{text}</span>}
      </span>
      {srText && <span className="sr-only">{srText}</span>}
      {href && targetLabel && <span className="sr-only">: go to {targetLabel}</span>}
    </>
  )
  const box = cx(TAG_BASE, 'h-7 rounded-full px-[11px] py-[5px]', scheme.surface, className)
  return href ? (
    <a href={href} className={cx(box, 'state-layer state-lift')}>
      {body}
    </a>
  ) : (
    <span className={box}>{body}</span>
  )
}
