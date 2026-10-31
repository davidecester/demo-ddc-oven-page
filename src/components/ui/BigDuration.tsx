import { cx } from '../../utils/cx'
import { formatDuration } from '../../utils/format'

interface BigDurationProps {
  /** `null`: no data yet, shown as "- h". */
  minutes: number | null
  /** Type style of the numbers, e.g. "type-heading-xs". */
  numberClass: string
  /** Type style of the units: smaller, regular weight, grey. */
  unitClass: string
  /** "m" instead of "min", where three totals share a narrow row. */
  shortMinutes?: boolean
}

/**
 * A large duration: numbers in black, units smaller and grey right after them ("104h 18min"); screen readers get
 * the plain "104 h 18 min".
 */
export function BigDuration({ minutes, numberClass, unitClass, shortMinutes = false }: BigDurationProps) {
  const unit = cx('ml-0.5 text-content-quaternary', unitClass)
  if (minutes === null)
    return (
      <span className="whitespace-nowrap">
        <span className={numberClass}>-</span>
        <span className={unit}>h</span>
      </span>
    )
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return (
    <span className="whitespace-nowrap text-content-primary tabular-nums">
      <span className="sr-only">{formatDuration(minutes * 60)}</span>
      <span aria-hidden="true">
        {h > 0 && (
          <>
            <span className={numberClass}>{h}</span>
            <span className={unit}>h</span>{' '}
          </>
        )}
        {(m > 0 || h === 0) && (
          <>
            <span className={numberClass}>{m}</span>
            <span className={unit}>{shortMinutes ? 'm' : 'min'}</span>
          </>
        )}
      </span>
    </span>
  )
}
