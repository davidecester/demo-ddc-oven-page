import type { Scenario } from '../../types/oven'
import { CHAMBER_MESSAGES } from '../shared'
import { cookingScenario } from './cooking'

/**
 * Scenario 3 — oven on standby right after a wash, but periodic maintenance is due and the
 * detergents are low (Figma: "Manutenzione Richiesta"). Everything not overridden matches Scenario 1.
 */
export const maintenanceScenario: Scenario = {
  ...cookingScenario,
  id: 'maintenance',
  label: 'Maintenance Required',

  oven: cookingScenario.oven,

  activity: {
    status: 'idle',
    label: 'Idle',
    // The wash that brought the chamber to 0%, 7 min before the 13:05 start
    lastActivity: { status: 'washing', endedAt: '2026-10-12T12:58:00' },
    dirtLevel: '0% · Clean',
    // Maintenance due: no actions, the notice explains why
    ctas: [],
    hint: null,
    // Same title and sentence as the alert below
    notice: { title: CHAMBER_MESSAGES.maintenance.title, description: CHAMBER_MESSAGES.maintenance.note },
  },

  alerts: [
    {
      id: 'maintenance',
      severity: 'critical',
      title: CHAMBER_MESSAGES.maintenance.title,
      description: CHAMBER_MESSAGES.maintenance.note,
      code: 'MN02',
      timestamp: '10/10/2026 12:05',
      action: { type: 'scheduleMaintenance', label: 'Schedule maintenance', doneLabel: 'Maintenance requested', icon: 'service-white' },
    },
    {
      id: 'detergents',
      severity: 'warning',
      title: 'Detergents running low',
      description: 'The detergent level is low.',
      code: 'CD04',
      timestamp: '09/10/2026 18:30',
      action: { type: 'orderConsumables', label: 'Order detergents', doneLabel: 'Detergents ordered', icon: 'consumables-white' },
      badgeIcon: { icon: 'sheet-consumables', icon16: 'sheet-consumables-16' },
    },
    ...cookingScenario.alerts.filter((a) => a.severity === 'info'),
  ],

  // Same 24 h as Scenario 1, but the chamber was just washed: 0% at 13:00.
  senseKlean: {
    current: 0,
    readAt: 'Today at 13:00',
    hourly: cookingScenario.senseKlean!.hourly.map((r) => (r.hour === '13:00' ? { ...r, value: 0 } : r)),
  },
}
