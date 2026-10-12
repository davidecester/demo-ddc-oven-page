import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface ProgressRingProps {
  /** 0–100 */
  value: number
  /** CSS colour of the arc (a token variable). */
  color: string
  /** 32px icon file name shown above the value. */
  icon: string
  /** Main value text, e.g. "68%". */
  valueText: ReactNode
  caption: string
  /** Accessible description, e.g. "Avanzamento cottura". */
  label: string
}

const SIZE = 200
const STROKE = 20
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Figma "Progress Ring": 200px ring, 20px track (#F3F4F6),
 * square-ended arc starting at 12 o'clock and running clockwise.
 */
export function ProgressRing({ value, color, icon, valueText, caption, label }: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const offset = CIRCUMFERENCE * (1 - clamped / 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={`${Math.round(clamped)}%, ${caption}`}
      className="relative size-[200px] shrink-0"
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--color-ring-track)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="butt"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pb-4">
        <div className="flex flex-col items-center gap-1">
          <Icon name={icon} size={32} />
          <p className="type-heading-xl text-content-primary tabular-nums">{valueText}</p>
        </div>
        <p className="type-label-xs text-content-quaternary">{caption}</p>
      </div>
    </div>
  )
}
