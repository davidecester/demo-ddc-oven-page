/**
 * Data model for the Oven page. Every card renders purely from these types,
 * so a new scenario is just a new object that satisfies `Scenario`.
 * A `null` section renders that card's empty state (e.g. a newly added oven).
 */

/** Variants of the Figma "Status Tag" component set. */
export type StatusTagType =
  | 'cooking'
  | 'washing'
  | 'idle'
  | 'filterGood'
  | 'filterExhausted'
  | 'offline'
  | 'maintenance'
  | 'critical'
  | 'warning'

export type ActivityStatus = 'cooking' | 'washing' | 'idle'

export type ConnectionStatus = 'online' | 'offline'

export interface OvenInfo {
  modelLine: string
  name: string
  group: string
  connection: ConnectionStatus
  warranty: string | null
  usageHours: string
  serialNumber: string
  productCode: string
  firmware: string
  image: { src: string; alt: string }
  /** Extra tags shown on the product image, e.g. `maintenance` (scenario 4). */
  extraTags?: StatusTagType[]
}

interface ActivityBase {
  status: ActivityStatus
}

export interface CookingActivity extends ActivityBase {
  status: 'cooking'
  recipe: string
  totalDurationSec: number
  remainingSec: number
  /** Chamber temperature when the scenario starts; it then converges to the target. */
  chamberTempC: number
  targetTempC: number
}

export interface WashingActivity extends ActivityBase {
  status: 'washing'
  label: string
  totalDurationSec: number
  remainingSec: number
}

export interface IdleActivity extends ActivityBase {
  status: 'idle'
  label: string
  dirtLevel: string | null
  /** Show the "Avvia lavaggio" CTA and hint (Figma Standby variant). */
  suggestWashing: boolean
  hint: string | null
}

export type Activity = CookingActivity | WashingActivity | IdleActivity

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface AlertAction {
  type: 'startWashing'
  label: string
}

export interface OvenAlert {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  code?: string
  timestamp: string
  action?: AlertAction
}

export interface ActivityTrendDay {
  day: string
  cooking: number
  washing: number
  standby: number
}

export type DirtLevel = 'clean' | 'dirty' | 'veryDirty'

export interface SenseKleanReading {
  hour: string
  /** Dirt level 0–100. A drop to 0 marks a wash. */
  value: number
}

export interface SenseKlean {
  current: number
  readAt: string
  hourly: SenseKleanReading[]
}

export type FilterStatus = 'good' | 'exhausted'

export interface RoCare {
  status: FilterStatus
  lifePercent: number
  remainingDuration: string
  remainingUnits: string
  waterHardness: string
  installedAt: string
  updatedAt: string
  helpLink: string
}

export type UsageCategoryKey = 'cookingSet' | 'programs' | 'chefunox' | 'multiTime' | 'other'

export interface UsageCategory {
  key: UsageCategoryKey
  label: string
  duration: string
  percent: number
}

export interface Usage {
  total: string
  categories: UsageCategory[]
}

export type RecipeCategoryIcon = 'beef' | 'seafood' | 'vegetable' | 'bread'
export type RecipeTabKey = 'programs' | 'multiTime' | 'miseEnPlace'

export interface RecipeCategory {
  name: string
  count: number
  icon: RecipeCategoryIcon
}

export interface RecipeTab {
  key: RecipeTabKey
  label: string
  categories: RecipeCategory[]
}

export type DownloadFileIcon = 'pdf' | 'folder'

export interface DownloadFile {
  name: string
  details: string
  icon: DownloadFileIcon
}

export interface DownloadGroup {
  title: string
  files: DownloadFile[]
}

export interface Scenario {
  id: string
  /** Label shown in the prototype scenario switcher. */
  label: string
  /** Simulated wall-clock time at scenario start (ISO, local time). */
  startsAt: string
  /** Wash cycle started by "Avvia lavaggio". */
  washingCycle: { label: string; totalDurationSec: number }
  oven: OvenInfo
  activity: Activity
  alerts: OvenAlert[]
  activityTrend: ActivityTrendDay[] | null
  senseKlean: SenseKlean | null
  roCare: RoCare | null
  usage: Usage | null
  recipes: RecipeTab[] | null
  downloads: DownloadGroup[]
}
