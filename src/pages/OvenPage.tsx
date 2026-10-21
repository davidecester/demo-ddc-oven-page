import { useCallback, useState } from 'react'
import { ActivityCard } from '../components/oven/ActivityCard'
import { ActivityTrendCard } from '../components/oven/ActivityTrendCard'
import { AlertsCard } from '../components/oven/AlertsCard'
import { AlertsSheet } from '../components/oven/AlertsSheet'
import { DownloadArea } from '../components/oven/DownloadArea'
import { OvenOverviewCard } from '../components/oven/OvenOverviewCard'
import { RecipesCard } from '../components/oven/RecipesCard'
import { RoCareCard } from '../components/oven/RoCareCard'
import { SenseKleanCard } from '../components/oven/SenseKleanCard'
import { UsageHoursCard } from '../components/oven/UsageHoursCard'
import { Toast } from '../components/ui/Toast'
import { useOvenSimulation } from '../hooks/useOvenSimulation'
import type { AlertAction, Scenario } from '../types/oven'

/** Column spans on the 4 / 8 / 12 page grid. */
const FULL = 'col-span-full'
const HALF = 'col-span-4 md:col-span-8 lg:col-span-6'

const TOAST_MESSAGE: Record<Exclude<AlertAction['type'], 'startWashing'>, string> = {
  scheduleMaintenance: 'Richiesta di manutenzione inviata',
  orderConsumables: 'Ordine detergenti inviato',
}

export function OvenPage({ scenario }: { scenario: Scenario }) {
  const { live, startWashing } = useOvenSimulation(scenario)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  const handleStartWashing = useCallback(() => {
    startWashing()
    setAlertsOpen(false)
    setAnnouncement('Lavaggio avviato')
  }, [startWashing])

  const handleAlertAction = useCallback(
    (action: AlertAction) => {
      if (action.type === 'startWashing') return handleStartWashing()
      // No screen behind these yet: confirm with a toast (closing the sheet so it isn't covered)
      setAlertsOpen(false)
      setToast(TOAST_MESSAGE[action.type])
    },
    [handleStartWashing],
  )

  const isActionRunning = useCallback(
    (action: AlertAction) => action.type === 'startWashing' && live.status === 'washing',
    [live.status],
  )

  return (
    <>
      <main
        id="main"
        className="page-grid px-4 pt-4 pb-[calc(var(--spacing-bottom-nav)+72px+env(safe-area-inset-bottom))] md:px-6 md:pt-6 lg:pb-6"
      >
        <OvenOverviewCard
          className={FULL}
          oven={scenario.oven}
          activityStatus={live.status}
          alerts={scenario.alerts}
        />
        {scenario.alerts.length > 0 && (
          <AlertsCard
            className={FULL}
            alerts={scenario.alerts}
            onOpenAll={() => setAlertsOpen(true)}
            onAction={handleAlertAction}
            isActionRunning={isActionRunning}
          />
        )}
        <ActivityCard className={HALF} activity={live} onStartWashing={handleStartWashing} />
        <ActivityTrendCard className={HALF} trend={scenario.activityTrend} />
        <SenseKleanCard className={FULL} data={scenario.senseKlean} />
        <RoCareCard className={HALF} data={scenario.roCare} />
        <UsageHoursCard className={HALF} data={scenario.usage} />
        <RecipesCard
          className={FULL}
          tabs={scenario.recipes}
          onCreateGroup={() => setToast('Nuovo gruppo di ricette creato')}
        />
        <DownloadArea className={FULL} groups={scenario.downloads} />
      </main>

      <AlertsSheet
        open={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={scenario.alerts}
        onAction={handleAlertAction}
        isActionRunning={isActionRunning}
      />

      <Toast message={toast} onDismiss={dismissToast} />

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  )
}
