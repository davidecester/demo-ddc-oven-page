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

const c = (start: string, end: string): ActivitySession => ({ status: 'cooking', start, end })
const w = (start: string, end: string): ActivitySession => ({ status: 'washing', start, end })

/**
 * Activity timeline of the 7 days up to the scenario start (Mon 12 Oct, 13:05). The late washes end just before
 * midnight and today's morning wash ends at 07:00, matching the SENSE.Klean drops to 0%. Each scenario adds the
 * rest of today with `weekUntilNow`.
 */
const PAST_DAYS: ActivityTrendDay[] = [
  { day: 'Tue', date: '6 Oct', sessions: [c('06:30', '09:00'), w('09:00', '09:45'), c('11:30', '13:30'), c('18:30', '20:00'), w('23:00', '23:50')] },
  { day: 'Wed', date: '7 Oct', sessions: [c('06:00', '09:00'), w('09:00', '10:00'), c('11:30', '14:00'), c('19:00', '20:00'), w('22:30', '23:35')] },
  { day: 'Thu', date: '8 Oct', sessions: [c('07:00', '09:30'), w('09:30', '10:15'), c('12:00', '13:30'), c('18:30', '20:00'), w('23:00', '23:50')] },
  { day: 'Fri', date: '9 Oct', sessions: [c('06:30', '09:00'), w('09:00', '10:00'), c('11:30', '14:00'), c('18:00', '19:30'), w('22:30', '23:35')] },
  { day: 'Sat', date: '10 Oct', sessions: [c('08:00', '10:30'), w('10:30', '11:30'), c('12:00', '14:00'), c('19:00', '21:00'), w('22:45', '23:50')] },
  { day: 'Sun', date: '11 Oct', sessions: [c('08:30', '10:30'), w('10:30', '11:15'), c('12:30', '14:00'), c('19:00', '20:30'), w('23:00', '23:55')] },
]

const TODAY_MORNING: ActivitySession[] = [w('06:15', '07:00'), c('07:30', '09:45')]

/** The past 6 days plus today: the morning cycles, then the scenario's own late-morning `sessions`, up to 13:05. */
export function weekUntilNow(sessions: ActivitySession[]): ActivityTrendDay[] {
  return [...PAST_DAYS, { day: 'Today', date: '12 Oct', sessions: [...TODAY_MORNING, ...sessions], until: '13:05' }]
}
