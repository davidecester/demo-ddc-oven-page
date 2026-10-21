import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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
 * Hovering (or tapping) a bar previews that reading in the header, like a
 * stock chart scrubber; leaving the chart returns to the current reading.
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
        <DirtChart data={data} wide={wide} selected={selected ?? lastIndex} onSelect={setSelected} />
      ) : data ? (
        // New oven: legend and axes faded, no bars (Figma "Forno Appena Registrato")
        <EmptyData>
          <DirtChart data={{ ...data, hourly: EMPTY_DAY }} wide={wide} selected={-1} onSelect={() => {}} empty />
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
      <p className="flex items-center gap-3">
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

function DirtChart({ data, wide, selected, onSelect, empty = false }: DirtChartProps) {
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

  const pick = (state: { activeTooltipIndex?: number | string | null }) => {
    const index = Number(state.activeTooltipIndex)
    if (state.activeTooltipIndex != null && Number.isInteger(index)) onSelect(index)
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

      <div ref={plotRef} className="h-[238px] w-full touch-pan-y md:h-[236px] [&_*]:outline-none" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.hourly}
            // Recharts applies the gap on both sides: 20% + 20% leaves a 60% bar (Figma 30 px of ~50 px)
            barCategoryGap="20%"
            // 100% grid line sits on the top edge as in Figma; its label overflows upwards
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            style={{ overflow: 'visible' }}
            accessibilityLayer={false}
            onMouseMove={empty ? undefined : pick}
            onClick={empty ? undefined : pick}
            onMouseLeave={empty ? undefined : () => onSelect(null)}
          >
            <CartesianGrid stroke={gridStroke} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={(props) => renderYTick({ ...props, format: (v) => `${v}%` })}
              width={44}
            />
            <XAxis
              dataKey="hour"
              ticks={ticks}
              interval={0}
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickMargin={8}
              height={36}
            />
            {/* No floating tooltip: the header above shows the hovered reading */}
            {!empty && <Tooltip cursor={{ fill: 'var(--color-grey-100)' }} content={() => null} />}
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
