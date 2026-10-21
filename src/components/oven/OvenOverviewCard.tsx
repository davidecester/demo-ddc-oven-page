import { useId, useState } from 'react'
import type { ActivityStatus, AlertSeverity, OvenAlert, OvenInfo, StatusTagType } from '../../types/oven'
import { Icon } from '../ui/Icon'
import { StatusTag } from '../ui/StatusTag'
import { sortBySeverity } from './alertConfig'
import { ACTIVITY_CARD_ID, ALERTS_CARD_ID } from './anchors'

interface OvenOverviewCardProps {
  oven: OvenInfo
  activityStatus: ActivityStatus
  alerts: OvenAlert[]
  className?: string
}

const ACTIVITY_TAG: Record<ActivityStatus, StatusTagType> = {
  cooking: 'cooking',
  washing: 'washing',
  idle: 'idle',
}

/** The most severe alert gets its own tag, by name; info alerts only count. */
const SEVERITY_TAG: Partial<Record<AlertSeverity, { type: StatusTagType; srLabel: string }>> = {
  critical: { type: 'alertCritical', srLabel: 'critico' },
  warning: { type: 'alertWarning', srLabel: 'attenzione' },
}

const ALERTS_TARGET = { id: ALERTS_CARD_ID, label: 'Avvisi' }

const CONNECTION_DOT = {
  online: { label: 'Online', dot: 'bg-green-eco-400' },
  offline: { label: 'Offline', dot: 'bg-content-quaternary' },
} as const

interface TagItem {
  key: string
  type: StatusTagType
  label?: string
  count?: number
  /** Replaces the visible text for screen readers, e.g. "2 altri avvisi". */
  srText?: string
  /** Card the tag links to, if any. */
  target?: { id: string; label: string }
}

/** Figma "Oven-Overview-Card": tags, name and a show/hide toggle for warranty and technical data. */
export function OvenOverviewCard({ oven, activityStatus, alerts, className }: OvenOverviewCardProps) {
  const [open, setOpen] = useState(false)
  const infoId = useId()
  const connection = CONNECTION_DOT[oven.connection]
  const top = sortBySeverity(alerts)[0]

  // Order as in Figma: neutral count of the other alerts, the most severe alert by name, then the live activity
  const severity = top ? SEVERITY_TAG[top.severity] : undefined
  const others = alerts.length - (severity ? 1 : 0)
  const tags: TagItem[] = [
    ...(others > 0
      ? [
          {
            key: 'count',
            type: 'alertCount' as const,
            count: others,
            srText: `${others} ${severity ? (others === 1 ? 'altro avviso' : 'altri avvisi') : others === 1 ? 'avviso' : 'avvisi'}`,
            target: ALERTS_TARGET,
          },
        ]
      : []),
    ...(top && severity
      ? [{ key: 'severity', type: severity.type, label: top.title, srText: `${top.title}, ${severity.srLabel}`, target: ALERTS_TARGET }]
      : []),
    oven.connection === 'offline'
      ? { key: 'activity', type: 'offline' as const }
      : { key: 'activity', type: ACTIVITY_TAG[activityStatus], target: { id: ACTIVITY_CARD_ID, label: 'Attività in corso' } },
  ]

  return (
    <section
      aria-labelledby="oven-name"
      className={`flex flex-col gap-6 rounded-lg bg-bg-primary p-4 shadow-elevation-1 md:flex-row md:p-6 ${className ?? ''}`}
    >
      {/* Desktop: 301px column that stretches with the info, so the oven grows when the info opens */}
      <div className="relative h-[150px] shrink-0 md:h-auto md:w-[301px] md:self-stretch">
        <img src={oven.image.src} alt={oven.image.alt} className="absolute inset-0 size-full object-contain" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <ul className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const visual = (
              <StatusTag type={tag.type} label={tag.label} count={tag.count} size="md" />
            )
            const content = tag.srText ? (
              <>
                <span aria-hidden="true" className="flex">{visual}</span>
                <span className="sr-only">{tag.srText}</span>
              </>
            ) : (
              visual
            )
            return (
              <li key={tag.key} className="flex">
                {tag.target ? (
                  <a href={`#${tag.target.id}`} className="state-layer flex rounded-full">
                    {content}
                    <span className="sr-only">: vai ad {tag.target.label}</span>
                  </a>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <p className="type-label-md text-blue-600">{oven.modelLine}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h1 id="oven-name" className="type-heading-lg text-content-primary">
                {oven.name}
              </h1>
              <span aria-hidden="true" title={connection.label} className={`size-2.5 rounded-full ${connection.dot}`} />
              <span className="sr-only">{connection.label}</span>
            </div>
            <p className="flex items-center gap-1">
              <span className="type-paragraph-sm text-content-quaternary">Gruppo:</span>
              <span className="font-fixed text-[14px] leading-4 font-bold text-content-primary">{oven.group}</span>
            </p>
          </div>

          <div className="flex flex-col">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={infoId}
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 self-start rounded-sm text-[14px] leading-4 font-medium text-accent underline decoration-from-font [text-underline-position:from-font]"
            >
              <Icon name={open ? 'link-collapse' : 'link-expand'} size={20} />
              {open ? 'Nascondi informazioni' : 'Mostra informazioni'}
            </button>

            {/* Grid 0fr → 1fr animates the panel to its real height, like the scenario switcher */}
            <div
              id={infoId}
              inert={!open}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex flex-col gap-4 pt-6">
                  {oven.warranty && (
                    <p className="flex items-center gap-1">
                      <Icon name="check-circle" size={20} />
                      <span className="type-paragraph-sm text-content-quaternary">
                        <span className="text-black">{oven.warranty.label}</span> {oven.warranty.value}
                      </span>
                    </p>
                  )}
                  <dl className="grid grid-cols-2 gap-2">
                    <InfoItem label="Ore di utilizzo" value={oven.usageHours} />
                    <InfoItem label="S/N" value={oven.serialNumber} />
                    <InfoItem label="Codice prodotto" value={oven.productCode} />
                    <InfoItem label="Firmware" value={oven.firmware} />
                  </dl>
                </div>
              </div>
            </div>
          </div>
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
