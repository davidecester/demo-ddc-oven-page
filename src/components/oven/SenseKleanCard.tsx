import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { TABLET_UP, useMediaQuery } from '../../hooks/useMediaQuery'
import type { SenseKlean } from '../../types/oven'
import { axisTick, gridStroke, renderYTick } from '../charts/chartTheme'
import { Card } from '../ui/Card'
import { EmptyData } from '../ui/EmptyData'
import { StatusTag } from '../ui/StatusTag'
import { DIRT_LEGEND, DIRT_LEVEL, dirtLevelOf, readingTimeLabel } from './senseKlean'

interface SenseKleanCardProps {
  data: SenseKlean | null
  className?: string
}

/** Desktop labels every 3 h; mobile keeps 3 labels like the Figma mobile frame. */
function labelledHours(hours: string[], wide: boolean): string[] {
  const step = wide ? 3 : 10
  return hours.filter((_, i) => i % step === 0)
}

/**
 * "SENSE.Klean – Livello di sporco": hourly dirt level over the last 24 h.
 * Hovering a column (desktop) or scrubbing a finger across the chart (touch)
 * previews that reading in the header, like a stock chart scrubber; moving the
 * mouse out, or tapping outside the chart, returns to the current reading.
 */
export function SenseKleanCard({ data, className }: SenseKleanCardProps) {
  const wide = useMediaQuery(TABLET_UP)
  const [selected, setSelected] = useState<number | null>(null)

  const hours = data?.hourly.map((h) => h.hour) ?? []
  const lastIndex = hours.length - 1
  const shown =
    data && selected !== null && selected !== lastIndex
      ? { value: data.hourly[selected].value, readAt: readingTimeLabel(hours, selected) }
      : data && { value: data.current, readAt: data.readAt }

  return (
    <Card labelledBy="sense-title" className={`gap-9 ${className ?? ''}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="sense-title" className="type-heading-xs text-content-primary">
            SENSE.Klean <span className="font-normal">– Dirt level</span>
          </h2>
          <p className="type-paragraph-sm text-content-quaternary">Last 24 hours</p>
        </div>
        {shown && <CurrentValue value={shown.value} readAt={shown.readAt} />}
      </div>

      {data && data.hourly.length > 0 ? (
        <DirtChart
          data={data}
          wide={wide}
          selected={selected ?? lastIndex}
          scrubbing={selected !== null}
          onSelect={setSelected}
        />
      ) : data ? (
        // New oven: legend and axes faded, no bars (Figma "Forno Appena Registrato")
        <EmptyData>
          <DirtChart
            data={{ ...data, hourly: EMPTY_DAY }}
            wide={wide}
            selected={-1}
            scrubbing={false}
            onSelect={() => {}}
            empty
          />
        </EmptyData>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">No data available</p>
      )}
    </Card>
  )
}

/** "Current value": the value in black, then a Warning / Critical S tag centred on it (none when clean); reading time below. */
function CurrentValue({ value, readAt }: { value: number; readAt: string | null }) {
  const level = DIRT_LEVEL[dirtLevelOf(value)]
  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-center gap-2">
        <span className="type-heading-sm md:type-heading-xl text-content-primary tabular-nums">{value}%</span>
        {level.tag ? (
          <StatusTag type={level.tag} label={level.label} />
        ) : (
          <span className="sr-only">{level.label}</span>
        )}
      </p>
      {readAt && <p className="type-paragraph-sm text-content-quaternary">{readAt}</p>}
    </div>
  )
}

interface DirtChartProps {
  data: SenseKlean
  wide: boolean
  /** Highlighted bar: the hovered/tapped one, or the latest reading. */
  selected: number
  /** The pointer is on a column: shade it like a chart cursor. */
  scrubbing: boolean
  /** `null` returns to the latest reading. */
  onSelect: (index: number | null) => void
  /** Placeholder for the empty state: axes and legend only, no bars or caption. */
  empty?: boolean
}

/** Hour labels for the empty chart: the same 24 h window as a reading day (14:00 → 13:00). */
const EMPTY_DAY: SenseKlean['hourly'] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String((14 + i) % 24).padStart(2, '0')}:00`,
  value: 0,
}))

/** Y axis gutter left of the bars; the columns share the remaining width evenly. */
const Y_AXIS_WIDTH = 44
/** X axis labels below the bars, outside the column shading. */
const X_AXIS_HEIGHT = 36

function DirtChart({ data, wide, selected, scrubbing, onSelect, empty = false }: DirtChartProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const ticks = labelledHours(
    data.hourly.map((h) => h.hour),
    wide,
  )
  const radius = wide ? 4 : 2

  // Touch has no "mouse leave": a tap outside the chart returns to the latest reading
  useEffect(() => {
    const reset = (event: PointerEvent) => {
      if (!plotRef.current?.contains(event.target as Node)) onSelect(null)
    }
    document.addEventListener('pointerdown', reset)
    return () => document.removeEventListener('pointerdown', reset)
  }, [onSelect])

  // Our own pointer tracking instead of Recharts' click/tooltip events, so a mouse
  // previews on hover and a finger previews while it slides, not only on tap.
  // `touch-pan-y` keeps vertical page scrolling; horizontal drags reach us.
  const count = data.hourly.length
  const pick = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const column = Math.floor(((event.clientX - box.left - Y_AXIS_WIDTH) / (box.width - Y_AXIS_WIDTH)) * count)
    const index = Math.min(count - 1, Math.max(0, column))
    if (index !== selected || !scrubbing) onSelect(index)
  }
  const pointer = empty
    ? {}
    : {
        onPointerDown: pick,
        onPointerMove: pick,
        // Touch keeps the scrubbed reading after lifting the finger, until a tap outside
        onPointerLeave: (event: ReactPointerEvent) => {
          if (event.pointerType === 'mouse') onSelect(null)
        },
      }

  return (
    <figure className="flex flex-col gap-6">
      <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 md:gap-x-6" aria-label="Legenda livelli">
        {DIRT_LEGEND.map((item) => (
          <li key={item.label} className="flex flex-col type-paragraph-sm">
            <span className="text-content-primary">{item.label}</span>
            <span className="text-content-quaternary">{item.range}</span>
          </li>
        ))}
      </ul>

      <div
        ref={plotRef}
        className="relative isolate h-[238px] w-full touch-pan-y select-none md:h-[236px] [&_*]:outline-none"
        aria-hidden="true"
        {...pointer}
      >
        {scrubbing && (
          // Column cursor behind the bars, the same wash Recharts' tooltip cursor drew
          <span
            className="pointer-events-none absolute top-0 -z-10 bg-grey-100"
            style={{
              bottom: X_AXIS_HEIGHT,
              left: `calc(${Y_AXIS_WIDTH}px + (100% - ${Y_AXIS_WIDTH}px) * ${selected / count})`,
              width: `calc((100% - ${Y_AXIS_WIDTH}px) / ${count})`,
            }}
          />
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.hourly}
            // Recharts applies the gap on both sides: 20% + 20% leaves a 60% bar (Figma 30 px of ~50 px)
            barCategoryGap="20%"
            // 100% grid line sits on the top edge as in Figma; its label overflows upwards
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            style={{ overflow: 'visible' }}
            accessibilityLayer={false}
          >
            <CartesianGrid stroke={gridStroke} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={(props) => renderYTick({ ...props, format: (v) => `${v}%` })}
              width={Y_AXIS_WIDTH}
            />
            <XAxis
              dataKey="hour"
              ticks={ticks}
              interval={0}
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickMargin={8}
              height={X_AXIS_HEIGHT}
            />
            <Bar
              dataKey="value"
              radius={[radius, radius, 0, 0]}
              // Empty state draws no bars (not even the 1 px wash marker)
              minPointSize={empty ? 0 : 1}
              isAnimationActive={false}
              label={({ index, x, y, width }) =>
                index === selected ? (
                  <circle
                    cx={Number(x) + Number(width) / 2}
                    cy={Number(y) - (wide ? 12 : 5)}
                    r={wide ? 7 : 3}
                    fill="var(--color-accent)"
                    stroke="var(--color-white)"
                    strokeWidth={wide ? 2 : 0}
                  />
                ) : (
                  <g />
                )
              }
            >
              {data.hourly.map((h, i) => (
                <Cell key={h.hour} fill={i === selected ? 'var(--color-accent)' : 'var(--color-grey-300)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!empty && (
        <figcaption className="sr-only">
          Hourly dirt level over the last 24 hours. Current value {data.current}%. Readings:{' '}
          {data.hourly.map((h) => `${h.hour} ${h.value === 0 ? 'washing' : `${h.value}%`}`).join(', ')}.
        </figcaption>
      )}
    </figure>
  )
}
