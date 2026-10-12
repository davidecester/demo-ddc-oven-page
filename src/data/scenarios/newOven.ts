import type { Scenario } from '../../types/oven'
import { sharedRecipes } from '../shared'
import { cookingScenario } from './cooking'

/**
 * Scenario 4 — oven just registered: no alerts, no history and no recipes yet; every
 * data card shows its empty state (Figma: "Forno Appena Registrato").
 */
export const newOvenScenario: Scenario = {
  ...cookingScenario,
  id: 'new-oven',
  label: 'Forno Appena Registrato',

  oven: { ...cookingScenario.oven, name: 'Nuovo Forno', usageHours: '0 h' },

  activity: {
    status: 'idle',
    label: 'In attesa',
    dirtLevel: '0% · Pulito',
    cta: { type: 'chooseRecipe', label: 'Scegli una ricetta', icon: 'library-white' },
    hint: 'Scegli un programma e imposta la prossima cottura.',
  },

  alerts: [],
  activityTrend: null,
  senseKlean: { current: 0, readAt: null, hourly: [] },

  // New cartridge: full life
  roCare: {
    ...cookingScenario.roCare!,
    lifePercent: 100,
    remainingDuration: '365 giorni',
    remainingUnits: '4',
  },

  usage: { total: '0 min', categories: [] },
  recipes: sharedRecipes.map((tab) => ({ ...tab, categories: [] })),
}
