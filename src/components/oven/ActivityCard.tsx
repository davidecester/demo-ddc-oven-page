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
import { DIRT_LEVEL, dirtLevelOf } from './senseKlean'

interface ActivityCardProps {
  activity: LiveActivity
  onStartWashing: () => void
  className?: string
}

/** Header tag uses the short labels of the Figma "Activity Card" variants. */
const HEADER_TAG: Record<LiveActivity['status'], { type: StatusTagType; label: string }> = {
  cooking: { type: 'cooking', label: 'Cooking' },
  washing: { type: 'washing', label: 'Washing' },
  idle: { type: 'idle', label: 'Idle' },
}

/** "Attività in corso" — variants: cooking / washing / idle (Figma "Activity Card"). */
export function ActivityCard({ activity, onStartWashing, className }: ActivityCardProps) {
  const tag = HEADER_TAG[activity.status]

  return (
    <Card id={ACTIVITY_CARD_ID} labelledBy="activity-title" className={`anchor-target gap-9 ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-2">
        <CardTitle id="activity-title">Current activity</CardTitle>
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
          caption={`${formatDuration(activity.remainingSec)} remaining`}
          label="Cooking progress"
        />
      )
    case 'washing':
      return (
        <ProgressRing
          value={activity.progress}
          color="var(--color-blue-500)"
          icon="washing-32"
          valueText={formatPercent(activity.progress)}
          caption={`${formatDuration(activity.remainingSec)} remaining`}
          label="Washing progress"
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

/** "78% · Very dirty", with the drop filled to that state. */
function DirtLevelValue({ value }: { value: number }) {
  const level = DIRT_LEVEL[dirtLevelOf(value)]
  return <LabelValue icon={level.icon} label="Chamber dirt level" value={`${formatPercent(value)} · ${level.label}`} />
}

function ActivityContent({ activity, onStartWashing }: { activity: LiveActivity; onStartWashing: () => void }) {
  switch (activity.status) {
    case 'cooking':
      return (
        <>
          <ActivityName label="Recipe" value={activity.recipe} />
          <div className="flex flex-col gap-4">
            <LabelValue icon="timelapse" label="Cooking ends" value={formatClock(activity.endsAt)} />
            <LabelValue
              icon="temperature"
              label="Chamber temperature (Target temperature)"
              value={
                <>
                  <span
                    className={`tabular-nums transition-colors duration-500 ${activity.targetReached ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {formatTemperature(activity.chamberTempC)}
                  </span>{' '}
                  <span className="tabular-nums">({formatTemperature(activity.targetTempC)})</span>
                  <span className="sr-only">
                    {activity.targetReached ? ', target temperature reached' : ', heating up'}
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
          <ActivityName label="Activity" value={activity.label} />
          <div className="flex flex-col gap-2">
            <LabelValue icon="timelapse" label="Washing ends" value={formatClock(activity.endsAt)} />
          </div>
        </>
      )
    case 'idle':
      return (
        <>
          <ActivityName label="Activity" value={activity.label} />
          {(activity.lastActivity || activity.dirtLevel !== null) && (
            <div className="flex flex-col gap-4">
              {activity.lastActivity && (
                <LabelValue icon="timelapse" label={activity.lastActivity.label} value={activity.lastActivity.value} />
              )}
              {activity.dirtLevel !== null && <DirtLevelValue value={activity.dirtLevel} />}
            </div>
          )}
          {activity.notice ? (
            // Maintenance due: a critical notice instead of actions (the alert carries "Schedule maintenance")
            <div className="flex items-start gap-2 rounded-lg bg-alarm-16 p-4">
              <Icon name="error-alarm" size={20} />
              <div className="flex flex-col gap-1">
                <p className="type-label-md text-content-primary">{activity.notice.title}</p>
                <p className="type-paragraph-xs text-content-quaternary">{activity.notice.description}</p>
              </div>
            </div>
          ) : (
            activity.ctas.length > 0 && (
              <div className="flex flex-col gap-2">
                {/* Always stacked and full width, the first one primary */}
                {activity.ctas.map((cta, i) => {
                  const variant = i === 0 ? 'primary' : 'secondary'
                  // Secondary buttons carry no icon, like the Figma toolbar button
                  const icon = i === 0 ? cta.icon : undefined
                  return cta.type === 'chooseRecipe' ? (
                    <ButtonLink key={cta.type} href={`#${RECIPES_CARD_ID}`} variant={variant} icon={icon} fullWidth>
                      {cta.label}
                    </ButtonLink>
                  ) : (
                    <Button key={cta.type} variant={variant} icon={icon} onClick={onStartWashing} fullWidth>
                      {cta.label}
                    </Button>
                  )
                })}
                {activity.hint && (
                  // Figma "Info-Row": 4 px between icon and text. The text shifts 2 px down (without growing the row)
                  // so its first line is centred on the 20 px icon, whether it wraps or not
                  <p className="flex items-start gap-1">
                    <Icon name="info-grey" size={20} />
                    <span className="-mb-0.5 pt-0.5 type-paragraph-sm text-content-quaternary">{activity.hint}</span>
                  </p>
                )}
              </div>
            )
          )}
        </>
      )
  }
}
