import type { ReactNode } from 'react'
import type { AlertAction, OvenAlert } from '../../types/oven'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { SEVERITY, sortBySeverity } from './alertConfig'

interface AlertsSheetProps {
  open: boolean
  onClose: () => void
  alerts: OvenAlert[]
  onAction: (action: AlertAction) => void
  isActionDone: (action: AlertAction) => boolean
}

/** "Tutti gli avvisi": alerts grouped into action required / information & history. */
export function AlertsSheet({ open, onClose, alerts, onAction, isActionDone }: AlertsSheetProps) {
  const sorted = sortBySeverity(alerts)
  const actionRequired = sorted.filter((a) => a.severity !== 'info')
  const informational = sorted.filter((a) => a.severity === 'info')

  return (
    <BottomSheet open={open} onClose={onClose} title="All alerts" titleId="all-alerts-title">
      <div className="flex flex-col gap-4">
        {actionRequired.length > 0 && (
          <AlertGroup id="group-action" title="Action required">
            {actionRequired.map((alert) => (
              <AlertItem key={alert.id} alert={alert} onAction={onAction} isActionDone={isActionDone} />
            ))}
          </AlertGroup>
        )}
        {informational.length > 0 && (
          <AlertGroup id="group-info" title="Information and history">
            {informational.map((alert) => (
              <AlertItem key={alert.id} alert={alert} onAction={onAction} isActionDone={isActionDone} />
            ))}
          </AlertGroup>
        )}
      </div>
    </BottomSheet>
  )
}

function AlertGroup({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h3 id={id} className="type-label-sm text-content-quaternary uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-1">{children}</ul>
    </section>
  )
}

interface AlertItemProps {
  alert: OvenAlert
  onAction: (action: AlertAction) => void
  isActionDone: (action: AlertAction) => boolean
}

function AlertItem({ alert, onAction, isActionDone }: AlertItemProps) {
  const sev = SEVERITY[alert.severity]
  const done = alert.action ? isActionDone(alert.action) : false
  const description = alert.code ? `${alert.description} (${alert.code})` : alert.description

  return (
    <li
      className={`flex flex-col justify-center rounded-lg p-4 md:flex-row md:items-center md:gap-4 ${sev.surface} ${alert.action ? 'gap-6' : 'gap-2'}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2 md:items-center md:gap-4">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-[20px] md:size-10 ${sev.badge}`}
        >
          <span className="md:hidden">
            <Icon name={alert.badgeIcon?.icon16 ?? sev.icon16} size={16} />
          </span>
          <span className="hidden md:block">
            <Icon name={alert.badgeIcon?.icon ?? sev.icon} size={20} />
          </span>
          <span className="sr-only">{sev.srLabel}</span>
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-1">
          <div className="flex flex-col gap-1">
            <p className="type-label-md text-content-primary">{alert.title}</p>
            <p className="type-paragraph-xs text-content-quaternary">{description}</p>
          </div>
          <p className="type-label-xs text-content-quaternary md:hidden">{alert.timestamp}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 md:items-end">
        <p className="hidden type-label-xs text-content-quaternary md:block">{alert.timestamp}</p>
        {alert.action && (
          <Button
            icon={alert.action.icon}
            fullWidth
            className="md:w-auto"
            onClick={() => !done && onAction(alert.action!)}
            aria-disabled={done || undefined}
          >
            {done ? alert.action.doneLabel : alert.action.label}
          </Button>
        )}
      </div>
    </li>
  )
}
