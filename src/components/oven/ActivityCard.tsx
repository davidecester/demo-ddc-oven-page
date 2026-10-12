import type { LiveActivity } from '../../hooks/useOvenSimulation'
import type { StatusTagType } from '../../types/oven'
import { formatClock, formatDuration, formatPercent, formatTemperature } from '../../utils/format'
import { Button, ButtonLink } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { LabelValue } from '../ui/LabelValue'
import { ProgressRing } from '../ui/ProgressRing'
import { StatusTag } from '../ui/StatusTag'
import { ACTIVITY_CARD_ID, RECIPES_CARD_ID } from './anchors'

interface ActivityCardProps {
  activity: LiveActivity
  onStartWashing: () => void
  className?: string
}

/** Header tag uses the short labels of the Figma "Activity Card" variants. */
const HEADER_TAG: Record<LiveActivity['status'], { type: StatusTagType; label: string }> = {
  cooking: { type: 'cooking', label: 'Cottura' },
  washing: { type: 'washing', label: 'Lavaggio' },
  idle: { type: 'idle', label: 'In attesa' },
}

/** "Attività in corso" — variants: cooking / washing / idle (Figma "Activity Card"). */
export function ActivityCard({ activity, onStartWashing, className }: ActivityCardProps) {
  const tag = HEADER_TAG[activity.status]

  return (
    <Card id={ACTIVITY_CARD_ID} labelledBy="activity-title" className={`anchor-target gap-9 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center gap-4">
        <CardTitle id="activity-title">Attività in corso</CardTitle>
        <StatusTag type={tag.type} label={tag.label} />
      </div>

      {/* Ring beside the details once the card is wide enough (Figma desktop), stacked otherwise (Figma mobile) */}
      <div className="flex flex-col items-center justify-center gap-9 @min-[520px]:flex-row @min-[520px]:justify-start @min-[520px]:gap-12">
        <ActivityVisual activity={activity} />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 @min-[520px]:gap-9">
          <ActivityContent activity={activity} onStartWashing={onStartWashing} />
        </div>
      </div>
    </Card>
  )
}

function ActivityVisual({ activity }: { activity: LiveActivity }) {
  switch (activity.status) {
    case 'cooking':
      return (
        <ProgressRing
          value={activity.progress}
          color="var(--color-orange-500)"
          icon="fire-32"
          valueText={formatPercent(activity.progress)}
          caption={`${formatDuration(activity.remainingSec)} rimanenti`}
          label="Avanzamento cottura"
        />
      )
    case 'washing':
      return (
        <ProgressRing
          value={activity.progress}
          color="var(--color-blue-500)"
          icon="washing-32"
          valueText={formatPercent(activity.progress)}
          caption={`${formatDuration(activity.remainingSec)} rimanenti`}
          label="Avanzamento lavaggio"
        />
      )
    case 'idle':
      return (
        // Figma idle ring slot: 100 px when stacked (mobile), 200 px beside the details (desktop)
        <div className="flex size-[100px] shrink-0 items-center justify-center @min-[520px]:size-[200px]">
          <Icon name="standby-32" size={32} />
        </div>
      )
  }
}

function ActivityName({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="type-paragraph-xs text-content-quaternary">{label}</p>
      <p className="type-title-xxl text-content-primary">{value}</p>
    </div>
  )
}

function ActivityContent({ activity, onStartWashing }: { activity: LiveActivity; onStartWashing: () => void }) {
  switch (activity.status) {
    case 'cooking':
      return (
        <>
          <ActivityName label="Ricetta" value={activity.recipe} />
          <div className="flex flex-col gap-4">
            <LabelValue icon="timelapse" label="Termine cottura" value={formatClock(activity.endsAt)} />
            <LabelValue
              icon="temperature"
              label="Temperatura camera (Temperatura target)"
              value={
                <>
                  <span
                    className={`tabular-nums transition-colors duration-500 ${activity.targetReached ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {formatTemperature(activity.chamberTempC)}
                  </span>{' '}
                  <span className="tabular-nums">({formatTemperature(activity.targetTempC)})</span>
                  <span className="sr-only">
                    {activity.targetReached ? ', temperatura target raggiunta' : ', in riscaldamento'}
                  </span>
                </>
              }
            />
          </div>
        </>
      )
    case 'washing':
      return (
        <>
          <ActivityName label="Attività" value={activity.label} />
          <div className="flex flex-col gap-2">
            <LabelValue icon="timelapse" label="Termine lavaggio" value={formatClock(activity.endsAt)} />
          </div>
        </>
      )
    case 'idle':
      return (
        <>
          <ActivityName label="Attività" value={activity.label} />
          {activity.dirtLevel && <LabelValue label="Livello sporco camera" value={activity.dirtLevel} />}
          {activity.cta && (
            <div className="flex flex-col items-start gap-2">
              {/* Full width when stacked (Figma mobile), hugging its label beside the ring (desktop) */}
              {activity.cta.type === 'chooseRecipe' ? (
                <ButtonLink
                  href={`#${RECIPES_CARD_ID}`}
                  icon={activity.cta.icon}
                  fullWidth
                  className="@min-[520px]:w-auto"
                >
                  {activity.cta.label}
                </ButtonLink>
              ) : (
                <Button icon={activity.cta.icon} onClick={onStartWashing} fullWidth className="@min-[520px]:w-auto">
                  {activity.cta.label}
                </Button>
              )}
              {activity.hint && (
                <p className="flex items-start gap-2">
                  <Icon name="info-grey" size={20} />
                  <span className="type-paragraph-sm text-content-quaternary">{activity.hint}</span>
                </p>
              )}
            </div>
          )}
        </>
      )
  }
}
