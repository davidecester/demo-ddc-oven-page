import type { ActivitySession, ActivityTrendDay } from '../../types/oven'

export type SegmentStatus = ActivitySession['status'] | 'standby'

export const SERIES: Record<SegmentStatus, { label: string; color: string }> = {
  cooking: { label: 'Cooking', color: 'var(--color-orange-500)' },
  washing: { label: 'Washing', color: 'var(--color-blue-400)' },
  // "Idle" like the activity card and the oven overview tag
  standby: { label: 'Idle', color: 'var(--color-grey-200)' },
}

/** A selected idle gap turns mid grey: plain grey200 is too close to the faded blocks around it. */
export const SELECTED_IDLE = 'var(--color-grey-300)'

export const selectedColor = (status: SegmentStatus) => (status === 'standby' ? SELECTED_IDLE : SERIES[status].color)

export const DAY_MINUTES = 24 * 60

/** A stretch of the day in minutes: a cycle, or the idle time between cycles. */
export interface Segment {
  status: SegmentStatus
  start: number
  end: number
  ongoing?: boolean
  name?: string
  type?: string
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const clock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/** Where the day's timeline stops: midnight, or now for today. */
export const dayEnd = (day: ActivityTrendDay) => (day.until ? toMinutes(day.until) : DAY_MINUTES)

/** The day's cycles with the idle gaps filled in, up to midnight (or now, for today). */
export function segmentsOf(day: ActivityTrendDay): Segment[] {
  const end = dayEnd(day)
  const segments: Segment[] = []
  let cursor = 0
  for (const s of [...day.sessions].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))) {
    const start = toMinutes(s.start)
    if (start > cursor) segments.push({ status: 'standby', start: cursor, end: start })
    segments.push({ status: s.status, start, end: toMinutes(s.end), ongoing: s.ongoing, name: s.name, type: s.type })
    cursor = toMinutes(s.end)
  }
  if (cursor < end) segments.push({ status: 'standby', start: cursor, end })
  return segments
}

export const totalOf = (segments: Segment[], status: SegmentStatus) =>
  segments.filter((s) => s.status === status).reduce((sum, s) => sum + s.end - s.start, 0)

export const EMPTY_WEEK: ActivityTrendDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
  day,
  date: day,
  sessions: [],
}))

/** Minutes per activity over the given days. */
export function totalsOf(days: ActivityTrendDay[]): Record<SegmentStatus, number> {
  const all = days.map(segmentsOf)
  const sum = (status: SegmentStatus) => all.reduce((t, segs) => t + totalOf(segs, status), 0)
  return { cooking: sum('cooking'), washing: sum('washing'), standby: sum('standby') }
}
