import type { Scenario } from '../../types/oven'
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
    dirtLevel: '78% · Very dirty',
    cta: { type: 'startWashing', label: 'Start washing', icon: 'washing-white' },
    hint: 'Washing required before the next cooking.',
  },

  alerts: [
    {
      id: 'very-dirty-chamber',
      severity: 'critical',
      title: 'Very dirty chamber',
      description: 'Washing required before the next cooking.',
      code: 'WF54',
      timestamp: '09/10/2026 18:30',
      action: { type: 'startWashing', label: 'Start washing', icon: 'washing-white' },
    },
    ...cookingScenario.alerts.filter((a) => a.severity === 'info'),
  ],

  // Same 24 h as Scenario 1, but the chamber kept getting dirtier: 78% at 13:00.
  senseKlean: {
    current: 78,
    readAt: 'Today at 13:00',
    hourly: cookingScenario.senseKlean!.hourly.map((r) => (r.hour === '13:00' ? { ...r, value: 78 } : r)),
  },
}
