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

  oven: { ...cookingScenario.oven, name: 'New Oven', usageHours: '0h' },

  activity: {
    status: 'idle',
    label: 'Idle',
    lastActivity: null,
    dirtLevel: 0,
    // Never used, so nothing to wash; no recipes yet either: the CTA leads to the same button in the Recipes card
    ctas: [{ type: 'chooseRecipe', label: 'Create a recipe group', icon: 'add-white' }],
    hint: 'No recipes on the oven yet. Create a recipe group and upload it to set up the next cooking.',
    notice: null,
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

  usage: { total: '0min', categories: [] },
  recipes: sharedRecipes.map((tab) => ({ ...tab, categories: [] })),
}
