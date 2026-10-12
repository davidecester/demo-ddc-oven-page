import type { Scenario } from '../../types/oven'
import { cookingScenario } from './cooking'

/**
 * Scenario 2 — oven on standby with a very dirty chamber: wash required before the next cooking
 * (Figma: "Activity in Progress - Idle"). Everything not overridden matches Scenario 1.
 */
export const idleScenario: Scenario = {
  ...cookingScenario,
  id: 'idle',
  label: '2 · In attesa',

  activity: {
    status: 'idle',
    label: 'In attesa',
    dirtLevel: '78% · Molto Sporco',
    cta: { type: 'startWashing', label: 'Avvia lavaggio', icon: 'washing-white' },
    hint: 'Consigliato lavaggio prima della prossima cottura.',
  },

  alerts: [
    {
      id: 'camera-molto-sporca',
      severity: 'critical',
      title: 'Camera Molto Sporca',
      description: 'Necessario lavaggio prima della prossima cottura.',
      code: 'WF54',
      timestamp: '09/10/2026 18:30',
      action: { type: 'startWashing', label: 'Avvia lavaggio', icon: 'washing-white' },
    },
    ...cookingScenario.alerts.filter((a) => a.severity === 'info'),
  ],

  // Same 24 h as Scenario 1, but the chamber kept getting dirtier: 78% at 13:00.
  senseKlean: {
    current: 78,
    readAt: 'Oggi alle 13:00',
    hourly: cookingScenario.senseKlean!.hourly.map((r) => (r.hour === '13:00' ? { ...r, value: 78 } : r)),
  },
}
