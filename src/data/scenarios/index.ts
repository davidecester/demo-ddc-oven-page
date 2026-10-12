import type { Scenario } from '../../types/oven'
import { cookingScenario } from './cooking'
import { idleScenario } from './idle'
import { maintenanceScenario } from './maintenance'
import { newOvenScenario } from './newOven'

/**
 * Scenario registry. To add a scenario, create `<id>.ts` next to this file
 * and append it here; it then appears in the switcher and at `?scenario=<id>`.
 */
export const scenarios: Scenario[] = [cookingScenario, idleScenario, maintenanceScenario, newOvenScenario]

export const defaultScenarioId = cookingScenario.id

export function findScenario(id: string | null): Scenario {
  return scenarios.find((s) => s.id === id) ?? cookingScenario
}
