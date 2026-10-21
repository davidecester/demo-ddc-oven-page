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
  label: 'Newly Registered Oven',

  oven: { ...cookingScenario.oven, name: 'New Oven', usageHours: '0 h' },

  activity: {
    status: 'idle',
    label: 'Idle',
    dirtLevel: '0% · Clean',
    cta: { type: 'chooseRecipe', label: 'Choose a recipe', icon: 'library-white' },
    hint: 'Choose a program and set up the next cooking.',
  },

  alerts: [],
  activityTrend: null,
  senseKlean: { current: 0, readAt: null, hourly: [] },

  // New cartridge: full life
  roCare: {
    ...cookingScenario.roCare!,
    lifePercent: 100,
    remainingDuration: '365 days',
    remainingUnits: '4',
    installedAt: '21/10/2026',
    updatedAt: '21/10/2026 12:05',
  },

  usage: { total: '0 min', categories: [] },
  recipes: sharedRecipes.map((tab) => ({ ...tab, categories: [] })),
}
