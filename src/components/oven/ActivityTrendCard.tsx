import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ActivityTrendDay } from '../../types/oven'
import { formatHours } from '../../utils/format'
import { axisTick, gridStroke, renderYTick } from '../charts/chartTheme'
import { ChartTooltip } from '../charts/ChartTooltip'
import { Card, CardTitle } from '../ui/Card'
import { EmptyData } from '../ui/EmptyData'
import { IconButton } from '../ui/Button'

interface ActivityTrendCardProps {
  trend: ActivityTrendDay[] | null
  className?: string
}

const SERIES = [
  { key: 'cooking', label: 'Cooking', color: 'var(--color-orange-500)' },
  { key: 'washing', label: 'Washing', color: 'var(--color-blue-400)' },
  { key: 'standby', label: 'Standby', color: 'var(--color-grey-400)' },
] as const

/** "Andamento attività": hours per day split into cooking / washing / standby. */
export function ActivityTrendCard({ trend, className }: ActivityTrendCardProps) {
  return (
    <Card labelledBy="trend-title" className={`gap-9 ${className ?? ''}`}>
      <div className="relative flex flex-col gap-1 pr-10">
        <CardTitle id="trend-title">Activity trend</CardTitle>
        <p className="type-paragraph-sm text-content-quaternary">Last 7 days</p>
        <IconButton
          icon="andamento-next"
          iconSize={24}
          boxSize={40}
          label="Open activity trend in Analytics"
          className="absolute -top-2 -right-2"
        />
      </div>

      {trend ? (
        <figure className="flex flex-col gap-4">
          <TrendChart trend={trend} />
          <figcaption className="sr-only">
            <table>
              <caption>Daily hours by activity, last 7 days</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  {SERIES.map((s) => (
                    <th key={s.key} scope="col">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trend.map((d) => (
                  <tr key={d.day}>
                    <th scope="row">{d.day}</th>
                    {SERIES.map((s) => (
                      <td key={s.key}>{formatHours(d[s.key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </figcaption>
        </figure>
      ) : (
        // New oven: empty week with "- h" axis labels (Figma "Forno Appena Registrato")
        <EmptyData>
          <div className="flex flex-col gap-4">
            <TrendChart trend={EMPTY_WEEK} />
          </div>
        </EmptyData>
      )}
    </Card>
  )
}

const EMPTY_WEEK: ActivityTrendDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
  day,
  cooking: 0,
  washing: 0,
  standby: 0,
}))

/** Legend and bar chart; with an all-zero week the hour labels read "- h". */
function TrendChart({ trend }: { trend: ActivityTrendDay[] }) {
  const empty = trend.every((d) => d.cooking + d.washing + d.standby === 0)
  return (
    <>
      <ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1" aria-label="Legenda">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1">
            <span aria-hidden="true" className="size-3 rounded-xs" style={{ background: s.color }} />
            <span className="type-paragraph-sm text-content-quaternary">{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="h-[187px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trend}
            barGap={2}
            barCategoryGap={8}
            margin={{ top: 15, right: 0, bottom: 0, left: 0 }}
            accessibilityLayer={false}
          >
            <CartesianGrid vertical={false} stroke={gridStroke} />
            <YAxis
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
              axisLine={false}
              tickLine={false}
              tick={(props) =>
                renderYTick({ ...props, format: (v) => (v % 6 === 0 ? (empty ? '- h' : `${v} h`) : '') })
              }
              width={40}
            />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTick} tickMargin={8} interval={0} />
            {!empty && (
              <Tooltip
                cursor={{ fill: 'var(--color-grey-100)' }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <ChartTooltip
                      title={String(label)}
                      rows={SERIES.map((s) => ({
                        label: s.label,
                        swatch: s.color,
                        value: formatHours(Number(payload.find((p) => p.dataKey === s.key)?.value ?? 0)),
                      }))}
                    />
                  ) : null
                }
              />
            )}
            {SERIES.map((s) => (
              <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
