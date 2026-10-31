import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ChartTooltip } from '../components/charts/ChartTooltip'
import { HourAxis, Track } from '../components/oven/ActivityTrendCard'
import {
  clock,
  dayEnd,
  EMPTY_WEEK,
  segmentsOf,
  selectedColor,
  SERIES,
  toMinutes,
  totalOf,
  type Segment,
  type SegmentStatus,
} from '../components/oven/activityTrend'
import { BigDuration } from '../components/ui/BigDuration'
import { EmptyData } from '../components/ui/EmptyData'
import type { ActivityTrendDay } from '../types/oven'
import { cx } from '../utils/cx'
import { formatDuration } from '../utils/format'

const minutes = (m: number) => formatDuration(m * 60)
const STATUSES: SegmentStatus[] = ['cooking', 'washing', 'standby']

/** "Andamento attività" in depth: week totals, an hour-by-hour heatmap and each day's cycles. */
export function ActivityTrendPage({ trend }: { trend: ActivityTrendDay[] | null }) {
  const days = trend ?? EMPTY_WEEK
  const [dayIndex, setDayIndex] = useState(days.length - 1)
  const detailRef = useRef<HTMLDivElement>(null)

  const showDay = (index: number) => {
    setDayIndex(index)
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const first = days[0]
  const last = days[days.length - 1]
  const range = trend ? `${first.date} – ${last.until ? `today ${last.until}` : last.date}` : null

  return (
    <main
      id="main"
      className="page-grid px-4 pt-4 pb-[calc(var(--spacing-bottom-nav)+72px+env(safe-area-inset-bottom))] md:px-6 md:pt-6 lg:pb-6"
    >
      {/* One white surface for the whole page; its sections are split by dividers, not separate cards */}
      <article aria-labelledby="trend-page-title" className="col-span-full flex flex-col rounded-lg bg-bg-primary p-4 shadow-elevation-1 md:p-6 lg:p-8">
        <header className="flex flex-col gap-1">
          <h1 id="trend-page-title" className="type-heading-sm text-content-primary">
            Activity trend
          </h1>
          <p className="type-paragraph-sm text-content-quaternary">Last 7 days{range && ` · ${range}`}</p>
        </header>

        <div className="mt-10 md:mt-12">
          <WeekSummary days={trend} />
        </div>
        <Divider />
        <HeatmapSection days={days} empty={!trend} onPickDay={showDay} selectedDay={trend ? dayIndex : null} />
        <Divider />
        <div ref={detailRef} className="scroll-mt-32">
          <DayDetailSection days={days} empty={!trend} index={dayIndex} onSelect={setDayIndex} />
        </div>
      </article>
    </main>
  )
}

function Divider() {
  return <hr className="my-10 border-grey-200 md:my-12 lg:my-14" />
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="type-heading-xs text-content-primary">
      {children}
    </h2>
  )
}

/* ---------- Week totals ---------- */

function WeekSummary({ days }: { days: ActivityTrendDay[] | null }) {
  const all = (days ?? []).map(segmentsOf)
  const sum = (status: SegmentStatus) => all.reduce((s, segs) => s + totalOf(segs, status), 0)
  const count = (status: SegmentStatus) => all.reduce((s, segs) => s + segs.filter((x) => x.status === status).length, 0)
  const tracked = all.reduce((s, segs) => s + segs.reduce((t, x) => t + x.end - x.start, 0), 0)
  const dayCount = days?.length ?? 7

  const tiles: { status: SegmentStatus; value: number | null; note: string }[] = days
    ? [
        {
          status: 'cooking',
          value: sum('cooking'),
          note: `${count('cooking')} cycles · ${minutes(Math.round(sum('cooking') / dayCount))} a day`,
        },
        {
          status: 'washing',
          value: sum('washing'),
          note: `${count('washing')} washes · ${minutes(Math.round(sum('washing') / dayCount))} a day`,
        },
        {
          status: 'standby',
          value: sum('standby'),
          note: `${Math.round((sum('standby') / tracked) * 100)}% of the time`,
        },
      ]
    : STATUSES.map((status) => ({ status, value: null, note: 'No data available yet' }))

  return (
    <section aria-labelledby="week-total-title" className="flex flex-col gap-4 md:gap-6">
      <SectionTitle id="week-total-title">This week</SectionTitle>
      {/*
        The page summary: the totals lead, large on the left, with the key on the right.
        One row per activity up to laptop width; on wide screens three columns split by vertical dividers.
      */}
      <ul className="flex flex-col divide-y divide-grey-200 xl:grid xl:grid-cols-3 xl:divide-x xl:divide-y-0">
        {tiles.map((t) => (
          <li
            key={t.status}
            className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0 md:py-6 xl:px-8 xl:py-0 xl:first:pl-0 xl:last:pr-0"
          >
            <span className="shrink-0">
              <BigDuration
                minutes={t.value}
                numberClass="type-heading-sm md:type-heading-xl"
                unitClass="type-paragraph-md md:type-heading-xs md:font-normal"
              />
            </span>
            <span className="flex min-w-0 flex-col items-end gap-1 text-right">
              <span className="flex items-center gap-2 type-label-md text-content-primary">
                <Swatch status={t.status} />
                {SERIES[t.status].label}
              </span>
              <span className="type-paragraph-xs text-content-quaternary">{t.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Swatch({ status, size = 'size-3' }: { status: SegmentStatus; size?: string }) {
  return <span aria-hidden="true" className={cx('shrink-0 rounded-xs', size)} style={{ background: SERIES[status].color }} />
}

function Legend({ extra }: { extra?: ReactNode }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-1" aria-label="Legend">
      {STATUSES.map((s) => (
        <li key={s} className="flex items-center gap-1">
          <Swatch status={s} />
          <span className="type-paragraph-sm text-content-quaternary">{SERIES[s].label}</span>
        </li>
      ))}
      {extra}
    </ul>
  )
}

/* ---------- Heatmap ---------- */

interface HourCell {
  cooking: number
  washing: number
  /** Minutes of the hour that have passed (today stops at now). */
  tracked: number
}

function hoursOf(day: ActivityTrendDay): HourCell[] {
  const end = dayEnd(day)
  return Array.from({ length: 24 }, (_, h) => {
    const from = h * 60
    const to = from + 60
    const overlap = (status: 'cooking' | 'washing') =>
      day.sessions
        .filter((s) => s.status === status)
        .reduce((sum, s) => sum + Math.max(0, Math.min(to, toMinutes(s.end)) - Math.max(from, toMinutes(s.start))), 0)
    return { cooking: overlap('cooking'), washing: overlap('washing'), tracked: Math.max(0, Math.min(to, end) - from) }
  })
}

/** Cooking or washing, whichever ran longer; tinted by how much of the hour it filled. Idle hours stay grey. */
function cellColor(cell: HourCell): string {
  if (cell.tracked === 0) return 'transparent'
  const status = cell.cooking >= cell.washing ? 'cooking' : 'washing'
  const busy = cell[status]
  if (busy === 0) return SERIES.standby.color
  return `color-mix(in srgb, ${SERIES[status].color} ${Math.round(30 + (busy / 60) * 70)}%, white)`
}

interface HeatmapSectionProps {
  days: ActivityTrendDay[]
  empty: boolean
  selectedDay: number | null
  onPickDay: (index: number) => void
}

function HeatmapSection({ days, empty, selectedDay, onPickDay }: HeatmapSectionProps) {
  const grid = (
    <div className="flex flex-col gap-4">
      <Legend
        extra={
          <li className="flex items-center gap-1">
            <span
              aria-hidden="true"
              className="size-3 rounded-xs"
              style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--color-orange-500) 30%, white), var(--color-orange-500))' }}
            />
            <span className="type-paragraph-sm text-content-quaternary">Lighter: part of the hour</span>
          </li>
        }
      />
      <HeatmapGrid days={days} interactive={!empty} selectedDay={selectedDay} onPickDay={onPickDay} />
    </div>
  )

  return (
    <section aria-labelledby="heatmap-title" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <SectionTitle id="heatmap-title">Hour by hour</SectionTitle>
        <p className="type-paragraph-sm text-content-quaternary">
          Each square is one hour, coloured by what the oven did most. Tap a day to see its cycles.
        </p>
      </div>
      {empty ? <EmptyData>{grid}</EmptyData> : grid}
    </section>
  )
}

const GUTTER = 48

function HeatmapGrid({
  days,
  interactive,
  selectedDay,
  onPickDay,
}: {
  days: ActivityTrendDay[]
  interactive: boolean
  selectedDay: number | null
  onPickDay: (index: number) => void
}) {
  const [hover, setHover] = useState<{ day: number; hour: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const cells = days.map(hoursOf)

  useEffect(() => {
    const reset = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setHover(null)
    }
    document.addEventListener('pointerdown', reset)
    return () => document.removeEventListener('pointerdown', reset)
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {days.map((day, d) => (
        <div key={day.date} className="flex items-center gap-2">
          {interactive ? (
            <button
              type="button"
              onClick={() => onPickDay(d)}
              aria-pressed={selectedDay === d}
              className={cx(
                'state-layer w-10 shrink-0 rounded-sm py-1 text-left type-paragraph-xs',
                selectedDay === d ? 'font-bold text-content-primary' : 'text-content-quaternary',
              )}
            >
              {day.day}
              <span className="sr-only">, show cycles</span>
            </button>
          ) : (
            <span className="w-10 shrink-0 py-1 type-paragraph-xs text-content-quaternary">{day.day}</span>
          )}
          <div
            className="relative grid flex-1 grid-cols-24 gap-[2px]"
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
            aria-hidden="true"
            onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
          >
            {cells[d].map((cell, h) => (
              <span
                key={h}
                onPointerEnter={interactive ? () => setHover({ day: d, hour: h }) : undefined}
                onPointerDown={interactive ? () => setHover({ day: d, hour: h }) : undefined}
                onClick={interactive ? () => onPickDay(d) : undefined}
                className={cx(
                  'h-6 rounded-[3px] md:h-8',
                  cell.tracked === 0 && 'border border-dashed border-grey-200',
                  interactive && 'cursor-pointer',
                  hover && hover.day === d && hover.hour === h && 'outline-2 outline-offset-1 outline-content-primary',
                )}
                style={{ background: cellColor(cell) }}
              />
            ))}
            {hover?.day === d && <HourTooltip day={day} hour={hover.hour} cell={cells[d][hover.hour]} />}
          </div>
        </div>
      ))}
      <div className="mt-1">
        <HourAxis gutter={GUTTER} />
      </div>
      {interactive && (
        <table className="sr-only">
          <caption>Minutes of cooking and washing per hour, last 7 days</caption>
          <tbody>
            {days.map((day, d) => (
              <tr key={day.date}>
                <th scope="row">{day.day}</th>
                <td>
                  {cells[d]
                    .map((c, h) => ({ c, h }))
                    .filter(({ c }) => c.cooking || c.washing)
                    .map(({ c, h }) => `${clock(h * 60)}: ${c.cooking ? `cooking ${c.cooking} min` : ''}${c.cooking && c.washing ? ', ' : ''}${c.washing ? `washing ${c.washing} min` : ''}`)
                    .join('; ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function HourTooltip({ day, hour, cell }: { day: ActivityTrendDay; hour: number; cell: HourCell }) {
  const ref = useRef<HTMLDivElement>(null)
  const [left, setLeft] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const row = el?.parentElement
    if (!el || !row) return
    const x = ((hour + 0.5) / 24) * row.offsetWidth - el.offsetWidth / 2
    setLeft(Math.min(row.offsetWidth - el.offsetWidth, Math.max(-GUTTER, x)))
  }, [hour])

  const idle = cell.tracked - cell.cooking - cell.washing
  const rows =
    cell.tracked === 0
      ? [{ label: 'Not yet', value: '—' }]
      : (['cooking', 'washing', 'standby'] as const)
          .map((s) => ({ s, value: s === 'standby' ? idle : cell[s] }))
          .filter(({ value }) => value > 0)
          .map(({ s, value }) => ({ label: SERIES[s].label, swatch: selectedColor(s), value: minutes(value) }))

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-[calc(100%+8px)] z-10 whitespace-nowrap"
      style={{ left: left ?? 0, visibility: left === null ? 'hidden' : undefined }}
    >
      <ChartTooltip
        title={`${day.day}${day.until ? '' : ` ${day.date}`} · ${clock(hour * 60)}–${clock(((hour + 1) % 24) * 60)}`}
        rows={rows}
      />
    </div>
  )
}

/* ---------- Day detail ---------- */

interface DayDetailSectionProps {
  days: ActivityTrendDay[]
  empty: boolean
  index: number
  onSelect: (index: number) => void
}

function DayDetailSection({ days, empty, index, onSelect }: DayDetailSectionProps) {
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  // The highlighted cycle, remembered with its day so switching days clears it
  const [highlight, setHighlight] = useState<{ day: number; segment: number } | null>(null)
  const selected = highlight?.day === index ? highlight.segment : null
  const setSelected = (segment: number | null) => setHighlight(segment === null ? null : { day: index, segment })
  const day = days[index]
  const segments = segmentsOf(day)
  const cycles = segments.map((s, i) => ({ s, i })).filter(({ s }) => s.status !== 'standby')

  // Keep the selected tab in view inside the scrolling tab row (without scrolling the page)
  const tabsScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const row = tabsScrollRef.current
    const tab = tabRefs.current[index]
    if (!row || !tab) return
    const left = tab.offsetLeft - row.offsetLeft
    if (left < row.scrollLeft) row.scrollLeft = left - 16
    else if (left + tab.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollLeft = left + tab.offsetWidth - row.clientWidth + 16
  }, [index])

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (i + delta + days.length) % days.length
    onSelect(next)
    tabRefs.current[next]?.focus()
  }

  const body = (
    <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${index}`} className="flex flex-col gap-6">
      <dl className="grid grid-cols-3 gap-2">
        {STATUSES.map((s) => (
          <div key={s} className="flex flex-col gap-1">
            <dt className="flex items-center gap-1 type-paragraph-xs text-content-quaternary">
              <Swatch status={s} size="size-2" />
              {SERIES[s].label}
            </dt>
            <dd className="type-label-md text-content-primary tabular-nums">{empty ? '- h' : minutes(totalOf(segments, s))}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2" aria-hidden="true">
        <div className="relative h-10">
          <Track segments={segments} selected={selected} />
        </div>
        <HourAxis gutter={0} />
      </div>

      {!empty && (
        <div className="flex flex-col gap-2">
          <h3 className="type-label-sm text-content-primary">
            {cycles.length} {cycles.length === 1 ? 'cycle' : 'cycles'}
          </h3>
          <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {cycles.map(({ s, i }) => (
              <SessionRow
                key={s.start}
                segment={s}
                active={selected === i}
                onEnter={() => setSelected(i)}
                onLeave={() => setSelected(null)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <section aria-labelledby="day-detail-title" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SectionTitle id="day-detail-title">Day by day</SectionTitle>
        <div ref={tabsScrollRef} className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div
            role="tablist"
            aria-labelledby="day-detail-title"
            className="inline-flex items-start gap-1 rounded-md bg-bg-secondary p-1 md:gap-2"
          >
            {days.map((d, i) => {
              const isSelected = i === index
              return (
                <button
                  key={d.date}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={isSelected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  disabled={empty}
                  onClick={() => onSelect(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cx(
                    'state-layer flex shrink-0 flex-col items-center rounded-sm px-3 py-1 whitespace-nowrap',
                    isSelected
                      ? 'bg-bg-primary text-content-primary'
                      : 'text-content-quaternary hover:text-content-primary',
                  )}
                >
                  <span className={cx('text-[14px] leading-4', isSelected ? 'font-fixed font-bold' : 'type-paragraph-sm')}>{d.day}</span>
                  {!empty && <span className="type-paragraph-xs">{d.date}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {empty ? <EmptyData>{body}</EmptyData> : body}
    </section>
  )
}

function SessionRow({
  segment,
  active,
  onEnter,
  onLeave,
}: {
  segment: Segment
  active: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const duration = minutes(segment.end - segment.start)
  return (
    <li
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={cx(
        'flex items-center gap-3 rounded-md bg-bg-secondary px-4 py-3 transition-shadow',
        active && 'ring-2 ring-content-primary',
      )}
    >
      <Swatch status={segment.status} size="size-4" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="type-label-md text-content-primary">
          {segment.name ?? SERIES[segment.status].label}
        </span>
        <span className="type-paragraph-xs text-content-quaternary">
          {SERIES[segment.status].label}
          {segment.type && ` · ${segment.type}`}
        </span>
        <span className="type-paragraph-xs text-content-quaternary tabular-nums">
          {clock(segment.start)} – {segment.ongoing ? 'now' : clock(segment.end)}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="type-label-sm text-content-primary tabular-nums">{duration}</span>
        {segment.ongoing && <span className="type-paragraph-xs text-content-quaternary">In progress</span>}
      </span>
    </li>
  )
}
