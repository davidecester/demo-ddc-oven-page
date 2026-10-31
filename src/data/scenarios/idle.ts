import type { Scenario } from '../../types/oven'
import { CHAMBER_MESSAGES, weekUntilNow } from '../shared'
import { cookingScenario } from './cooking'

/**
 * Scenario 2 — oven on standby with a very dirty chamber: wash required before the next cooking
 * (Figma: "Activity in Progress - Idle"). Everything not overridden matches Scenario 1.
 */
export const idleScenario: Scenario = {
  ...cookingScenario,
  id: 'idle',
  label: 'Activity in Progress - Idle',

  activity: {
    status: 'idle',
    label: 'Idle',
    // 25 min before the 13:05 start
    lastActivity: { status: 'cooking', endedAt: '2026-10-12T12:40:00' },
    dirtLevel: 78,
    ctas: [{ type: 'startWashing', label: 'Start washing', icon: 'washing-white' }],
    hint: CHAMBER_MESSAGES.veryDirty.note,
    notice: null,
  },

  alerts: [
    {
      id: 'very-dirty-chamber',
      severity: 'critical',
      title: CHAMBER_MESSAGES.veryDirty.title,
      description: CHAMBER_MESSAGES.veryDirty.note,
      code: 'WF54',
      timestamp: '09/10/2026 18:30',
      action: { type: 'startWashing', label: 'Start washing', doneLabel: 'Washing in progress', icon: 'washing-white' },
    },
    ...cookingScenario.alerts.filter((a) => a.severity === 'info'),
  ],

  // The last cooking ended at 12:40 ("Last cooking ended" in the activity card)
  activityTrend: weekUntilNow([{ status: 'cooking', start: '10:25', end: '12:40', name: 'Roast chicken', type: 'Program 12' }]),

  // Same 24 h as Scenario 1, but the chamber kept getting dirtier: 78% at 13:00.
  senseKlean: {
    current: 78,
    readAt: 'Today at 13:00',
    hourly: cookingScenario.senseKlean!.hourly.map((r) => (r.hour === '13:00' ? { ...r, value: 78 } : r)),
  },
}
