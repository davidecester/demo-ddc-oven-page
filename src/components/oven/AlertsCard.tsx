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

/** "Avvisi": the most severe alert as a banner, plus a row that opens the full list. */
export function AlertsCard({ alerts, onOpenAll, onAction, isActionRunning, className }: AlertsCardProps) {
  const [top, ...rest] = sortBySeverity(alerts)

  return (
    <Card id={ALERTS_CARD_ID} labelledBy="alerts-title" className={`anchor-target gap-9 ${className ?? ''}`}>
      <CardTitle id="alerts-title">Avvisi</CardTitle>

      {top ? (
        <div className="flex flex-col gap-2">
          <div
            className={`flex flex-col justify-center gap-6 rounded-lg p-4 md:flex-row md:items-center md:gap-4 ${SEVERITY[top.severity].surface}`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {SEVERITY[top.severity].tag && (
                <div className="flex">
                  <StatusTag type={SEVERITY[top.severity].tag!} />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h3 className="type-label-md text-content-primary">{top.title}</h3>
                <p className="type-paragraph-xs text-content-quaternary">{top.description}</p>
              </div>
            </div>
            {top.action && (
              <Button
                icon={top.action.icon}
                onClick={() => !isActionRunning(top.action!) && onAction(top.action!)}
                aria-disabled={isActionRunning(top.action) || undefined}
                className="w-full md:w-auto"
              >
                {top.action.label}
              </Button>
            )}
          </div>

          {rest.length > 0 && (
            <button
              type="button"
              onClick={onOpenAll}
              aria-haspopup="dialog"
              className="state-layer flex w-full items-center justify-between rounded-lg bg-bg-secondary p-4 text-left"
            >
              <span className="flex items-center gap-3">
                <Icon name={SEVERITY[top.severity].dot} size={20} />
                <span className="type-paragraph-md text-content-primary">
                  +{rest.length} altri avvisi
                </span>
              </span>
              <Icon name="chevron-next" size={24} />
            </button>
          )}
        </div>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">Nessun avviso</p>
      )}
    </Card>
  )
}
