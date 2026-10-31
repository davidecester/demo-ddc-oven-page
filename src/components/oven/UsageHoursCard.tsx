import type { Usage, UsageCategory, UsageCategoryKey } from '../../types/oven'
import { Card, CardTitle } from '../ui/Card'
import { EmptyData } from '../ui/EmptyData'
import { Icon } from '../ui/Icon'

interface UsageHoursCardProps {
  data: Usage | null
  className?: string
}

const CATEGORY: Record<UsageCategoryKey, { label: string; icon: string | null; bar: string }> = {
  cookingSet: { label: 'Cooking Set', icon: 'cooking-set', bar: 'bg-brown-500' },
  programs: { label: 'Programs', icon: 'programs', bar: 'bg-blue-300' },
  chefunox: { label: 'CHEFUNOX', icon: 'chefunox', bar: 'bg-purple-300' },
  multiTime: { label: 'MULTI.Time', icon: 'multi-time', bar: 'bg-magenta-300' },
  other: { label: 'Other', icon: null, bar: 'bg-grey-300' },
}

/** New oven: every category at "- min · 0%" (Figma "Forno Appena Registrato"). */
const EMPTY_CATEGORIES: UsageCategory[] = (Object.keys(CATEGORY) as UsageCategoryKey[]).map((key) => ({
  key,
  label: CATEGORY[key].label,
  duration: '- min',
  percent: 0,
}))

/** "Ore di utilizzo totali": usage split by cooking mode. */
export function UsageHoursCard({ data, className }: UsageHoursCardProps) {
  return (
    <Card labelledBy="usage-title" className={`gap-9 ${className ?? ''}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle id="usage-title">Total usage hours</CardTitle>
          <p className="type-paragraph-sm text-content-quaternary">Last 7 days</p>
        </div>
        {data && <TotalHours total={data.total} />}
      </div>

      {data && data.categories.length > 0 ? (
        <CategoryList categories={data.categories} />
      ) : data ? (
        <EmptyData fade="rows">
          <CategoryList categories={EMPTY_CATEGORIES} />
        </EmptyData>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">No data available</p>
      )}
    </Card>
  )
}

/**
 * "42 h 30 min" with the numbers in black and the units smaller in grey, like the Activity trend totals; the
 * units stay at 20 px so they read comfortably next to the 36 px figures.
 */
function TotalHours({ total }: { total: string }) {
  const parts = [...total.matchAll(/(\d+)\s*(h|min)/g)]
  return (
    <p className="text-content-primary tabular-nums">
      <span className="sr-only">{total}</span>
      <span aria-hidden="true">
        {parts.map(([, value, unit], i) => (
          <span key={unit}>
            {i > 0 && ' '}
            <span className="type-heading-xl">{value}</span>
            <span className="ml-0.5 type-heading-xs text-content-quaternary">{unit}</span>
          </span>
        ))}
      </span>
    </p>
  )
}

function CategoryList({ categories }: { categories: UsageCategory[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {categories.map((c) => {
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
  )
}
