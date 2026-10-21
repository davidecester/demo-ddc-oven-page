import type { AlertAction, OvenAlert } from '../../types/oven'
import { Button } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { StatusTag } from '../ui/StatusTag'
import { ALERTS_CARD_ID } from './anchors'
import { SEVERITY, sortBySeverity } from './alertConfig'

interface AlertsCardProps {
  alerts: OvenAlert[]
  onOpenAll: () => void
  onAction: (action: AlertAction) => void
  /** Action already running (e.g. wash started): its CTA is shown disabled. */
  isActionRunning: (action: AlertAction) => boolean
  className?: string
}

/** "Avvisi": a banner per alert that needs action, plus a row that opens the full list. */
export function AlertsCard({ alerts, onOpenAll, onAction, isActionRunning, className }: AlertsCardProps) {
  const sorted = sortBySeverity(alerts)
  // Every alert that needs action gets its own banner; the rest are counted in the row below
  const actionable = sorted.filter((a) => a.severity !== 'info')
  const banners = actionable.length > 0 ? actionable : sorted.slice(0, 1)
  const rest = sorted.length - banners.length
  const top = sorted[0]

  return (
    <Card id={ALERTS_CARD_ID} labelledBy="alerts-title" className={`anchor-target gap-9 ${className ?? ''}`}>
      <CardTitle id="alerts-title">Alerts</CardTitle>

      {top ? (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-1">
            {banners.map((alert) => (
              <li key={alert.id}>
                <AlertBanner alert={alert} onAction={onAction} isActionRunning={isActionRunning} />
              </li>
            ))}
          </ul>

          {rest > 0 && (
            <button
              type="button"
              onClick={onOpenAll}
              aria-haspopup="dialog"
              className="state-layer flex w-full items-center justify-between rounded-lg bg-bg-secondary p-4 text-left"
            >
              <span className="flex items-center gap-2">
                {/* Dot in the colour of the most severe alert */}
                <Icon name={SEVERITY[top.severity].dot} size={20} />
                <span className="type-paragraph-md text-content-primary">+{rest} more {rest === 1 ? 'alert' : 'alerts'}</span>
              </span>
              <Icon name="chevron-next" size={24} />
            </button>
          )}
        </div>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">No alerts</p>
      )}
    </Card>
  )
}

interface AlertBannerProps {
  alert: OvenAlert
  onAction: (action: AlertAction) => void
  isActionRunning: (action: AlertAction) => boolean
}

/** Figma "Most-Severe-Alert-Banner": severity tag, title, description and the alert's CTA. */
function AlertBanner({ alert, onAction, isActionRunning }: AlertBannerProps) {
  const sev = SEVERITY[alert.severity]
  const running = alert.action ? isActionRunning(alert.action) : false
  return (
    <div
      className={`flex flex-col justify-center gap-6 rounded-lg p-4 md:flex-row md:items-center md:gap-4 ${sev.surface}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {sev.tag && (
          <div className="flex">
            <StatusTag type={sev.tag} />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="type-label-md text-content-primary">{alert.title}</h3>
          <p className="type-paragraph-xs text-content-quaternary">{alert.description}</p>
        </div>
      </div>
      {alert.action && (
        <Button
          icon={alert.action.icon}
          onClick={() => !running && onAction(alert.action!)}
          aria-disabled={running || undefined}
          className="w-full md:w-auto"
        >
          {alert.action.label}
        </Button>
      )}
    </div>
  )
}
