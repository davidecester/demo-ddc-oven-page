import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { ActivityTrendDay } from '../../types/oven'
import { formatDuration } from '../../utils/format'
import { ChartTooltip } from '../charts/ChartTooltip'
import { Card, CardTitle } from '../ui/Card'
import { EmptyData } from '../ui/EmptyData'
import { IconButton } from '../ui/Button'
import {
  clock,
  DAY_MINUTES,
  EMPTY_WEEK,
  segmentsOf,
  selectedColor,
  SERIES,
  totalOf,
  type Segment,
} from './activityTrend'

interface ActivityTrendCardProps {
  trend: ActivityTrendDay[] | null
  /** The arrow: opens the Activity trend page. */
  onOpen?: () => void
  className?: string
}

/** Day label column plus its 8 px gap; the hour axis starts after it. */
const LABEL_GUTTER = 48

/** "Andamento attività": when each cooking and wash ran over the last 7 days, one 24 h row per day. */
export function ActivityTrendCard({ trend, onOpen, className }: ActivityTrendCardProps) {
  return (
    <Card labelledBy="trend-title" className={`gap-9 ${className ?? ''}`}>
      <div className="relative flex flex-col gap-1 pr-10">
        <CardTitle id="trend-title">Activity trend</CardTitle>
        <p className="type-paragraph-sm text-content-quaternary">Last 7 days</p>
        <IconButton
          icon="andamento-next"
          iconSize={24}
          boxSize={40}
          label="Open activity trend"
          onClick={onOpen}
          className="absolute -top-2 -right-2"
        />
      </div>

      {trend ? (
        <figure className="flex flex-col gap-4">
          <Timeline days={trend} />
          <figcaption className="sr-only">
            <table>
              <caption>Cooking and washing cycles by day, last 7 days</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Cycles</th>
                  <th scope="col">Cooking</th>
                  <th scope="col">Washing</th>
                </tr>
              </thead>
              <tbody>
                {trend.map((day) => {
                  const segments = segmentsOf(day)
                  return (
                    <tr key={day.date}>
                      <th scope="row">
                        {day.day} {day.date}
                      </th>
                      <td>
                        {day.sessions
                          .map((s) => `${SERIES[s.status].label} ${s.start} to ${s.ongoing ? 'now' : s.end}`)
                          .join(', ')}
                      </td>
                      <td>{formatDuration(totalOf(segments, 'cooking') * 60)}</td>
                      <td>{formatDuration(totalOf(segments, 'washing') * 60)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </figcaption>
        </figure>
      ) : (
        // New oven: an empty week of idle rows behind the "no data" message
        <EmptyData>
          {/* Same 16 px legend-to-rows gap as the figure above */}
          <div className="flex flex-col gap-4">
            <Timeline days={EMPTY_WEEK} empty />
          </div>
        </EmptyData>
      )}
    </Card>
  )
}

interface Selection {
  day: number
  segment: number
}

/**
 * Legend, one row per day and the hour axis. Hovering a block (desktop) or sliding a finger along a row (touch)
 * shows when it started and ended and how long it lasted, like the SENSE.Klean scrubber; moving the mouse out, or
 * tapping outside the rows, hides it.
 */
function Timeline({ days, empty = false }: { days: ActivityTrendDay[]; empty?: boolean }) {
  const rowsRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Selection | null>(null)
  const daySegments = days.map(segmentsOf)

  // Touch has no "mouse leave": a tap outside the rows hides the details
  useEffect(() => {
    const reset = (event: PointerEvent) => {
      if (!rowsRef.current?.contains(event.target as Node)) setSelected(null)
    }
    document.addEventListener('pointerdown', reset)
    return () => document.removeEventListener('pointerdown', reset)
  }, [])

  // `touch-pan-y` keeps vertical page scrolling; horizontal slides reach us, and stay on the row they started on
  const pick = (day: number) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const minute = ((event.clientX - box.left) / box.width) * DAY_MINUTES
    const segment = daySegments[day].findIndex((s) => minute >= s.start && minute < s.end)
    if (segment === -1) setSelected(null)
    else if (selected?.day !== day || selected.segment !== segment) setSelected({ day, segment })
  }

  return (
    <>
      <ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1" aria-label="Legend">
        {Object.values(SERIES).map((s) => (
          <li key={s.label} className="flex items-center gap-1">
            <span aria-hidden="true" className="size-3 rounded-xs" style={{ background: s.color }} />
            <span className="type-paragraph-sm text-content-quaternary">{s.label}</span>
          </li>
        ))}
      </ul>

      <div ref={rowsRef} className="flex flex-col gap-3" aria-hidden="true">
        {days.map((day, d) => (
          <div key={day.date} className="flex items-center gap-2">
            <span
              className={`w-10 shrink-0 type-paragraph-xs ${day.until ? 'text-content-primary' : 'text-content-quaternary'}`}
            >
              {day.day}
            </span>
            <div
              className="relative h-4 flex-1 touch-pan-y select-none"
              {...(empty
                ? {}
                : {
                    onPointerDown: pick(d),
                    onPointerMove: pick(d),
                    onPointerLeave: (event: ReactPointerEvent) => {
                      if (event.pointerType === 'mouse') setSelected(null)
                    },
                  })}
            >
              <Track segments={daySegments[d]} selected={selected?.day === d ? selected.segment : null} />
              {selected?.day === d && <SegmentTooltip day={day} segment={daySegments[d][selected.segment]} />}
            </div>
          </div>
        ))}
        <HourAxis />
      </div>
    </>
  )
}

/**
 * One day: grey idle time, coloured cycles, white 6-hour guides; the rest of today stays blank.
 * While a block is selected the rest of the row fades, so the selection keeps its own colour.
 */
export function Track({ segments, selected }: { segments: Segment[]; selected: number | null }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-sm bg-grey-100">
      {/* Idle first, then the 6-hour guides, then the cycles on top so the guides never cut through them */}
      {segments.map(
        (s, i) =>
          s.status === 'standby' && (
            <SegmentBar key={s.start} segment={s} dim={selected !== null && selected !== i} picked={selected === i} />
          ),
      )}
      {[6, 12, 18].map((h) => (
        <span key={h} className="absolute inset-y-0 w-px bg-white" style={{ left: `${(h / 24) * 100}%` }} />
      ))}
      {segments.map(
        (s, i) =>
          s.status !== 'standby' && (
            // Back-to-back cycles (a wash right after cooking) get a 2 px white seam so both stay visible
            <SegmentBar
                key={s.start}
                segment={s}
                seam={i > 0 && segments[i - 1].status !== 'standby'}
                dim={selected !== null && selected !== i}
              />
          ),
      )}
    </div>
  )
}

interface SegmentBarProps {
  segment: Segment
  seam?: boolean
  dim?: boolean
  picked?: boolean
}

function SegmentBar({ segment, seam = false, dim = false, picked = false }: SegmentBarProps) {
  return (
    <span
      className={`absolute inset-y-0 ${seam ? 'border-l-2 border-white' : ''}`}
      style={{
        left: `${(segment.start / DAY_MINUTES) * 100}%`,
        width: `${((segment.end - segment.start) / DAY_MINUTES) * 100}%`,
        // Faded as a solid tint (30% on white), not opacity, so the guides behind don't show through
        background: picked
          ? selectedColor(segment.status)
          : dim
            ? `color-mix(in srgb, ${SERIES[segment.status].color} 30%, white)`
            : SERIES[segment.status].color,
      }}
    />
  )
}

/** Above the row, centred on the block and kept inside the card. */
function SegmentTooltip({ day, segment }: { day: ActivityTrendDay; segment: Segment }) {
  const ref = useRef<HTMLDivElement>(null)
  const [left, setLeft] = useState<number | null>(null)
  const centre = (segment.start + segment.end) / 2 / DAY_MINUTES

  useLayoutEffect(() => {
    const el = ref.current
    const track = el?.parentElement
    if (!el || !track) return
    const width = el.offsetWidth
    const x = centre * track.offsetWidth - width / 2
    setLeft(Math.min(track.offsetWidth - width, Math.max(-LABEL_GUTTER, x)))
  }, [centre])

  const duration = formatDuration((segment.end - segment.start) * 60)
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-[calc(100%+8px)] z-10 whitespace-nowrap"
      style={{ left: left ?? 0, visibility: left === null ? 'hidden' : undefined }}
    >
      <ChartTooltip
        title={`${day.day} ${day.until ? '' : day.date}`.trim()}
        rows={[
          {
            label: SERIES[segment.status].label,
            swatch: selectedColor(segment.status),
            value: `${clock(segment.start)} – ${segment.ongoing ? 'now' : clock(segment.end)}`,
          },
          { label: 'Duration', value: segment.ongoing ? `${duration} so far` : duration },
        ]}
      />
    </div>
  )
}

export function HourAxis({ gutter = LABEL_GUTTER }: { gutter?: number }) {
  return (
    <div className="relative h-4" style={{ marginLeft: gutter }}>
      {[0, 6, 12, 18, 24].map((h) => (
        <span
          key={h}
          className="absolute type-paragraph-xs text-content-quaternary"
          // Edge labels align to the row ends instead of overflowing them
          style={{
            left: `${(h / 24) * 100}%`,
            transform: h === 0 ? undefined : h === 24 ? 'translateX(-100%)' : 'translateX(-50%)',
          }}
        >
          {clock(h * 60)}
        </span>
      ))}
    </div>
  )
}
