/** "1 h 16 min" / "3 min" (minutes rounded up, as an oven display would). */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.max(0, Math.ceil(totalSeconds / 60))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

/** Decimal hours → "6 h 21 min" (chart tooltips). */
export function formatHours(hours: number): string {
  return formatDuration(Math.round(hours * 60) * 60)
}

/** Clock time "13:42". */
export function formatClock(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)} °C`
}
