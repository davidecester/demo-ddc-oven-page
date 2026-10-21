import type { Scenario } from '../../types/oven'
import { cookingScenario } from './cooking'

/**
 * Scenario 3 — oven on standby right after a wash, but periodic maintenance is due and the
 * detergents are low (Figma: "Manutenzione Richiesta"). Everything not overridden matches Scenario 1.
 */
export const maintenanceScenario: Scenario = {
  ...cookingScenario,
  id: 'maintenance',
  label: 'Manutenzione Richiesta',

  oven: cookingScenario.oven,

  activity: {
    status: 'idle',
    label: 'In attesa',
    dirtLevel: '0% · Pulito',
    cta: { type: 'chooseRecipe', label: 'Scegli una ricetta', icon: 'library-white' },
    hint: 'Scegli un programma e imposta la prossima cottura.',
  },

  alerts: [
    {
      id: 'manutenzione',
      severity: 'critical',
      title: 'Manutenzione richiesta',
      description: 'È necessario pianificare il controllo periodico del forno.',
      code: 'MN02',
      timestamp: '10/10/2026 12:05',
      action: { type: 'scheduleMaintenance', label: 'Pianifica manutenzione', icon: 'service-white' },
    },
    {
      id: 'consumabili',
      severity: 'warning',
      title: 'Detergenti quasi esauriti',
      description: 'Il livello dei detergenti è basso.',
      code: 'CD04',
      timestamp: '09/10/2026 18:30',
      action: { type: 'orderConsumables', label: 'Ordina detergenti', icon: 'consumables-white' },
      badgeIcon: { icon: 'sheet-consumables', icon16: 'sheet-consumables-16' },
    },
    ...cookingScenario.alerts.filter((a) => a.severity === 'info'),
  ],

  // Same 24 h as Scenario 1, but the chamber was just washed: 0% at 13:00.
  senseKlean: {
    current: 0,
    readAt: 'Oggi alle 13:00',
    hourly: cookingScenario.senseKlean!.hourly.map((r) => (r.hour === '13:00' ? { ...r, value: 0 } : r)),
  },
}
