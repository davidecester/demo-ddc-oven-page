import type { ActivitySession, ActivityTrendDay, DownloadGroup, RecipeTab } from '../types/oven'

/**
 * One sentence per chamber dirt level, used word for word as the idle card hint and as the dirt
 * alert's title and description, so the card and the alert never suggest different actions.
 */
export const CHAMBER_MESSAGES = {
  veryDirty: { title: 'Very dirty chamber', note: 'Washing required before the next cooking.' },
  dirty: { title: 'Dirty chamber', note: 'Washing recommended soon. You can still cook in the meantime.' },
  clean: { title: 'Clean chamber', note: 'Chamber clean: ready for the next cooking.' },
} as const

/** Recipes stored on the oven. Each tab has its own categories, with icons from the Figma "Chefunox food categories" set. */
export const sharedRecipes: RecipeTab[] = [
  {
    key: 'programs',
    label: 'Programs',
    categories: [
      { name: 'Beef', count: 8, icon: 'beef' },
      { name: 'Fish', count: 5, icon: 'seafood' },
      { name: 'Vegetables', count: 6, icon: 'vegetable' },
      { name: 'Bakery', count: 5, icon: 'bread' },
    ],
  },
  {
    key: 'multiTime',
    label: 'MULTI.Time',
    categories: [
      { name: 'Chicken', count: 2, icon: 'chicken' },
      { name: 'Pizza', count: 2, icon: 'pizza' },
      { name: 'Frozen snacks', count: 3, icon: 'frozenSnack' },
      { name: 'Sandwiches', count: 1, icon: 'sandwich' },
    ],
  },
  {
    key: 'miseEnPlace',
    label: 'MISE.EN.PLACE',
    categories: [
      { name: 'Eggs', count: 1, icon: 'eggs' },
      { name: 'Puff pastry', count: 2, icon: 'puffPastry' },
      { name: 'Dessert', count: 1, icon: 'dessert' },
      { name: 'Toast', count: 1, icon: 'toast' },
    ],
  },
]

export const sharedDownloads: DownloadGroup[] = [
  {
    title: 'Manuals',
    files: [
      { name: 'User manual', details: 'PDF · 4.2 MB', icon: 'pdf' },
      { name: 'Installation manual', details: 'PDF · 2.8 MB', icon: 'pdf' },
    ],
  },
  {
    title: 'Data sheets',
    files: [{ name: 'XEVC-1011 data sheet', details: 'PDF · 1.1 MB', icon: 'pdf' }],
  },
  {
    title: 'Firmware',
    files: [
      { name: 'Firmware 4.12.3', details: 'ZIP · 38 MB', icon: 'folder' },
      { name: 'Release notes', details: 'PDF · 0.4 MB', icon: 'pdf' },
    ],
  },
  {
    title: 'Other',
    files: [{ name: 'Declaration of conformity', details: 'PDF · 0.6 MB', icon: 'pdf' }],
  },
]

const c = (start: string, end: string, name: string, type: string): ActivitySession => ({
  status: 'cooking',
  start,
  end,
  name,
  type,
})
const w = (start: string, end: string, name: WashProgram): ActivitySession => ({
  status: 'washing',
  start,
  end,
  name,
  type: WASH_TYPE[name],
})

type WashProgram = 'Rinse' | 'Eco wash' | 'Medium wash' | 'Intense wash'
const WASH_TYPE: Record<WashProgram, string> = {
  Rinse: 'Quick · water only',
  'Eco wash': 'Light dirt',
  'Medium wash': 'Normal dirt',
  'Intense wash': 'Heavy dirt',
}

/**
 * Activity timeline of the 7 days up to the scenario start (Mon 12 Oct, 13:05). The late washes end just before
 * midnight and today's morning wash ends at 07:00, matching the SENSE.Klean drops to 0%. Each scenario adds the
 * rest of today with `weekUntilNow`. Recipe names and modes match the oven's recipe groups and usage categories.
 */
const PAST_DAYS: ActivityTrendDay[] = [
  { day: 'Tue', date: '6 Oct', sessions: [c('06:30', '09:00', 'Croissants', 'MULTI.Time'), w('09:00', '09:45', 'Eco wash'), c('11:30', '13:30', 'Roast beef', 'Program 4'), c('18:30', '20:00', 'Grilled salmon', 'CHEFUNOX'), w('23:00', '23:50', 'Intense wash')] },
  { day: 'Wed', date: '7 Oct', sessions: [c('06:00', '09:00', 'Bread rolls', 'Program 18'), w('09:00', '10:00', 'Medium wash'), c('11:30', '14:00', 'Roast chicken', 'Program 12'), c('19:00', '20:00', 'Pizza', 'MULTI.Time'), w('22:30', '23:35', 'Intense wash')] },
  { day: 'Thu', date: '8 Oct', sessions: [c('07:00', '09:30', 'Croissants', 'MULTI.Time'), w('09:30', '10:15', 'Eco wash'), c('12:00', '13:30', 'Steamed vegetables', 'Cooking Set'), c('18:30', '20:00', 'Lasagne', 'CHEFUNOX'), w('23:00', '23:50', 'Intense wash')] },
  { day: 'Fri', date: '9 Oct', sessions: [c('06:30', '09:00', 'Bread rolls', 'Program 18'), w('09:00', '10:00', 'Medium wash'), c('11:30', '14:00', 'Roast beef', 'Program 4'), c('18:00', '19:30', 'Baked cod', 'Cooking Set'), w('22:30', '23:35', 'Intense wash')] },
  { day: 'Sat', date: '10 Oct', sessions: [c('08:00', '10:30', 'Puff pastry', 'MISE.EN.PLACE'), w('10:30', '11:30', 'Medium wash'), c('12:00', '14:00', 'Roast chicken', 'Program 12'), c('19:00', '21:00', 'Pizza', 'MULTI.Time'), w('22:45', '23:50', 'Intense wash')] },
  { day: 'Sun', date: '11 Oct', sessions: [c('08:30', '10:30', 'Croissants', 'MULTI.Time'), w('10:30', '11:15', 'Eco wash'), c('12:30', '14:00', 'Roast beef', 'Program 4'), c('19:00', '20:30', 'Grilled salmon', 'CHEFUNOX'), w('23:00', '23:55', 'Intense wash')] },
]

const TODAY_MORNING: ActivitySession[] = [w('06:15', '07:00', 'Rinse'), c('07:30', '09:45', 'Bread rolls', 'Program 18')]

/** The past 6 days plus today: the morning cycles, then the scenario's own late-morning `sessions`, up to 13:05. */
export function weekUntilNow(sessions: ActivitySession[]): ActivityTrendDay[] {
  return [...PAST_DAYS, { day: 'Today', date: '12 Oct', sessions: [...TODAY_MORNING, ...sessions], until: '13:05' }]
}
