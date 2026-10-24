import type { DownloadGroup, RecipeTab } from '../types/oven'

/**
 * One sentence per chamber state, used word for word as the idle card hint (or notice) and as the
 * related alert's title and description, so the card and the alert never say different things.
 */
export const CHAMBER_MESSAGES = {
  veryDirty: { title: 'Very dirty chamber', note: 'Washing required before the next cooking.' },
  dirty: { title: 'Dirty chamber', note: 'Washing recommended soon. You can still cook in the meantime.' },
  clean: { title: 'Clean chamber', note: 'Chamber clean: ready for the next cooking.' },
  maintenance: {
    title: 'Maintenance required',
    note: 'Cooking and washing are unavailable until the periodic maintenance is done.',
  },
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
