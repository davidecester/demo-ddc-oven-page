import type { Usage, UsageCategoryKey } from '../../types/oven'
import { Card, CardTitle } from '../ui/Card'
import { Icon } from '../ui/Icon'

interface UsageHoursCardProps {
  data: Usage | null
  className?: string
}

const CATEGORY: Record<UsageCategoryKey, { icon: string | null; bar: string }> = {
  cookingSet: { icon: 'cooking-set', bar: 'bg-brown-500' },
  programs: { icon: 'programs', bar: 'bg-blue-300' },
  chefunox: { icon: 'chefunox', bar: 'bg-purple-300' },
  multiTime: { icon: 'multi-time', bar: 'bg-magenta-300' },
  other: { icon: null, bar: 'bg-grey-300' },
}

/** "Ore di utilizzo totali": usage split by cooking mode. */
export function UsageHoursCard({ data, className }: UsageHoursCardProps) {
  return (
    <Card labelledBy="usage-title" className={`gap-9 ${className ?? ''}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle id="usage-title">Ore di utilizzo totali</CardTitle>
          <p className="type-paragraph-sm text-content-quaternary">Ultimi 7 giorni</p>
        </div>
        {data && <p className="type-heading-xl text-content-primary">{data.total}</p>}
      </div>

      {data ? (
        <ul className="flex flex-col gap-4">
          {data.categories.map((c) => {
            const cfg = CATEGORY[c.key]
            return (
              <li key={c.key} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {cfg.icon && <Icon name={cfg.icon} size={20} />}
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-4">
                    <span className="type-label-md text-content-primary">{c.label}</span>
                    <span className="flex items-center gap-4 type-paragraph-sm whitespace-nowrap">
                      <span className="text-content-quaternary">{c.duration}</span>
                      <span className="min-w-[34px] text-right text-content-primary tabular-nums">{c.percent}%</span>
                    </span>
                  </div>
                </div>
                <div
                  role="meter"
                  aria-label={c.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={c.percent}
                  aria-valuetext={`${c.percent}%, ${c.duration}`}
                  className="h-2 w-full rounded-sm bg-grey-100"
                >
                  <div className={`h-2 rounded-sm ${cfg.bar}`} style={{ width: `${c.percent}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">Nessun dato disponibile</p>
      )}
    </Card>
  )
}
