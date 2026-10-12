import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ActivityTrendDay } from '../../types/oven'
import { formatHours } from '../../utils/format'
import { axisTick, gridStroke, renderYTick } from '../charts/chartTheme'
import { ChartTooltip } from '../charts/ChartTooltip'
import { Card, CardTitle } from '../ui/Card'
import { IconButton } from '../ui/Button'

interface ActivityTrendCardProps {
  trend: ActivityTrendDay[] | null
  className?: string
}

const SERIES = [
  { key: 'cooking', label: 'Cottura', color: 'var(--color-orange-500)' },
  { key: 'washing', label: 'Lavaggio', color: 'var(--color-blue-400)' },
  { key: 'standby', label: 'Standby', color: 'var(--color-grey-400)' },
] as const

/** "Andamento attività": hours per day split into cooking / washing / standby. */
export function ActivityTrendCard({ trend, className }: ActivityTrendCardProps) {
  return (
    <Card labelledBy="trend-title" className={`gap-9 ${className ?? ''}`}>
      <div className="relative flex flex-col gap-1 pr-10">
        <CardTitle id="trend-title">Andamento attività</CardTitle>
        <p className="type-paragraph-sm text-content-quaternary">Ultimi 7 giorni</p>
        <IconButton
          icon="andamento-next"
          iconSize={24}
          boxSize={40}
          label="Apri andamento attività in Analytics"
          className="absolute -top-2 -right-2"
        />
      </div>

      {trend ? (
        <figure className="flex flex-col gap-4">
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
                  tick={(props) => renderYTick({ ...props, format: (v) => (v % 6 === 0 ? `${v} h` : '') })}
                  width={40}
                />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTick} tickMargin={8} interval={0} />
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
                {SERIES.map((s) => (
                  <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <figcaption className="sr-only">
            <table>
              <caption>Ore giornaliere per attività, ultimi 7 giorni</caption>
              <thead>
                <tr>
                  <th scope="col">Giorno</th>
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
        <p className="type-paragraph-sm text-content-quaternary">Nessun dato disponibile</p>
      )}
    </Card>
  )
}
