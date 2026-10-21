import type { FilterStatus, RoCare, StatusTagType } from '../../types/oven'
import { formatPercent } from '../../utils/format'
import { Card } from '../ui/Card'
import { LabelValue } from '../ui/LabelValue'
import { ProgressRing } from '../ui/ProgressRing'
import { StatusTag } from '../ui/StatusTag'

interface RoCareCardProps {
  data: RoCare | null
  className?: string
}

const FILTER: Record<FilterStatus, { tag: StatusTagType; ring: string }> = {
  good: { tag: 'filterGood', ring: 'var(--color-green-500)' },
  // Placeholder until the scenario 5 frame defines the exhausted ring colour
  exhausted: { tag: 'filterExhausted', ring: 'var(--color-alarm)' },
}

/** "Filtro RO.Care": water filter remaining life. */
export function RoCareCard({ data, className }: RoCareCardProps) {
  return (
    <Card labelledBy="rocare-title" className={`gap-9 ${className ?? ''}`}>
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <h2 id="rocare-title" className="type-heading-xs text-content-primary">
            RO.Care filter
          </h2>
          {data && <StatusTag type={FILTER[data.status].tag} />}
        </div>
        <p className="type-paragraph-sm text-content-quaternary">Water filter</p>
      </div>

      {data ? (
        <div className="flex flex-col items-center justify-center gap-9 @min-[520px]:flex-row @min-[520px]:justify-start @min-[520px]:gap-12">
          <ProgressRing
            value={data.lifePercent}
            color={FILTER[data.status].ring}
            icon="water-32"
            valueText={formatPercent(data.lifePercent)}
            caption="Remaining life"
            label="Filter remaining life"
          />
          <div className="flex w-full min-w-0 flex-1 flex-col gap-9">
            <div className="flex flex-col gap-4">
              <LabelValue label="Remaining time" value={data.remainingDuration} />
              <LabelValue label="Units remaining" value={data.remainingUnits} />
              <LabelValue label="Water hardness" value={data.waterHardness} />
              <LabelValue label="Installation date" value={data.installedAt} />
              <LabelValue label="Last update" value={data.updatedAt} />
            </div>
            <a
              href={data.helpLink}
              onClick={(e) => e.preventDefault()}
              className="self-start rounded-sm font-fixed text-[14px] leading-4 text-accent underline hover:no-underline"
            >
              How to replace the filter
            </a>
          </div>
        </div>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">No data available</p>
      )}
    </Card>
  )
}
