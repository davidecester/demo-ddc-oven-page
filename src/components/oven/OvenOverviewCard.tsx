import type { ActivityStatus, OvenAlert, OvenInfo, StatusTagType } from '../../types/oven'
import { Icon } from '../ui/Icon'
import { StatusTag } from '../ui/StatusTag'
import { ACTIVITY_CARD_ID, ALERTS_CARD_ID } from './anchors'

interface OvenOverviewCardProps {
  oven: OvenInfo
  activityStatus: ActivityStatus
  alerts: OvenAlert[]
  onOpenAlerts: () => void
  className?: string
}

const ACTIVITY_TAG: Record<ActivityStatus, StatusTagType> = {
  cooking: 'cooking',
  washing: 'washing',
  idle: 'idle',
}

/** Image tags that link to the card explaining them. */
const TAG_TARGET: Partial<Record<StatusTagType, { id: string; label: string }>> = {
  maintenance: { id: ALERTS_CARD_ID, label: 'Avvisi' },
}

const CONNECTION = {
  online: { label: 'Online', dot: 'bg-green-eco-400' },
  offline: { label: 'Offline', dot: 'bg-content-quaternary' },
} as const

export function OvenOverviewCard({ oven, activityStatus, alerts, onOpenAlerts, className }: OvenOverviewCardProps) {
  // The live activity tag links to the "Attività in corso" card; offline/extra tags stay static
  const activityTag = oven.connection === 'offline' ? null : ACTIVITY_TAG[activityStatus]
  const tags: StatusTagType[] = [...(activityTag ? [] : (['offline'] as const)), ...(oven.extraTags ?? [])]
  const actionCount = alerts.filter((a) => a.action).length
  const connection = CONNECTION[oven.connection]

  return (
    <section
      aria-labelledby="oven-name"
      className={`rounded-lg bg-bg-primary p-4 shadow-elevation-1 md:p-6 ${className ?? ''}`}
    >
      {/* Inner grid mirrors the page grid: image = 4 of 12 columns on desktop */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-6 md:grid-cols-8 md:gap-x-4 lg:grid-cols-12">
        <div className="relative col-span-4 h-[300px] rounded-md md:col-span-3 lg:col-span-4">
          <img
            src={oven.image.src}
            alt={oven.image.alt}
            className="absolute inset-0 size-full rounded-md object-contain"
          />
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-2">
            {activityTag && (
              <a href={`#${ACTIVITY_CARD_ID}`} className="state-layer flex rounded-lg">
                <StatusTag type={activityTag} />
                <span className="sr-only">: vai ad Attività in corso</span>
              </a>
            )}
            {tags.map((tag) => {
              const target = TAG_TARGET[tag]
              return target ? (
                <a key={tag} href={`#${target.id}`} className="state-layer flex rounded-lg">
                  <StatusTag type={tag} />
                  <span className="sr-only">: vai ad {target.label}</span>
                </a>
              ) : (
                <StatusTag key={tag} type={tag} />
              )
            })}
          </div>
        </div>

        <div className="col-span-4 flex min-w-0 flex-col justify-between gap-9 md:col-span-5 lg:col-span-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="type-label-md text-blue-600">{oven.modelLine}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <h1 id="oven-name" className="type-heading-lg text-content-primary">
                  {oven.name}
                </h1>
                <span className="flex items-center gap-1">
                  <span aria-hidden="true" className={`size-2 rounded-full ${connection.dot}`} />
                  <span className="type-label-xs text-content-primary">{connection.label}</span>
                </span>
              </div>
              <p className="flex items-center gap-1">
                <span className="type-paragraph-sm text-content-quaternary">Gruppo:</span>
                <span className="font-fixed text-[14px] leading-4 font-bold text-content-primary">{oven.group}</span>
              </p>
            </div>
            {oven.warranty && (
              <p className="flex items-center gap-1">
                <Icon name="check-circle" size={20} />
                <span className="type-paragraph-sm text-content-quaternary">{oven.warranty}</span>
              </p>
            )}
          </div>

          <p className="flex items-center gap-1">
            <Icon name="info-accent" size={20} />
            <button
              type="button"
              onClick={onOpenAlerts}
              aria-haspopup="dialog"
              className="rounded-sm text-[14px] leading-4 text-accent hover:underline"
            >
              <span className="font-fixed font-bold">Avvisi:</span>{' '}
              <span className="font-fixed">{alerts.length}</span>
            </button>
            <span className="type-paragraph-sm text-content-quaternary">· {actionCount} {actionCount === 1 ? 'richiede' : 'richiedono'} azione</span>
          </p>

          <dl className="grid grid-cols-2 gap-2">
            <InfoItem label="Ore di utilizzo" value={oven.usageHours} />
            <InfoItem label="S/N" value={oven.serialNumber} />
            <InfoItem label="Codice prodotto" value={oven.productCode} />
            <InfoItem label="Firmware" value={oven.firmware} />
          </dl>
        </div>
      </div>
    </section>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="type-paragraph-xs text-content-quaternary">{label}</dt>
      <dd className="type-label-md break-words text-content-primary">{value}</dd>
    </div>
  )
}
