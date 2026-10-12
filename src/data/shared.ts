import type { DownloadGroup, RecipeTab } from '../types/oven'

/** Recipes stored on the oven. MULTI.Time and MISE.EN.PLACE reuse the Programmi layout with their own counts. */
export const sharedRecipes: RecipeTab[] = [
  {
    key: 'programs',
    label: 'Programmi',
    categories: [
      { name: 'Manzo', count: 8, icon: 'beef' },
      { name: 'Pesce', count: 5, icon: 'seafood' },
      { name: 'Verdure', count: 6, icon: 'vegetable' },
      { name: 'Panificazione', count: 5, icon: 'bread' },
    ],
  },
  {
    key: 'multiTime',
    label: 'MULTI.Time',
    categories: [
      { name: 'Manzo', count: 2, icon: 'beef' },
      { name: 'Pesce', count: 2, icon: 'seafood' },
      { name: 'Verdure', count: 3, icon: 'vegetable' },
      { name: 'Panificazione', count: 1, icon: 'bread' },
    ],
  },
  {
    key: 'miseEnPlace',
    label: 'MISE.EN.PLACE',
    categories: [
      { name: 'Manzo', count: 1, icon: 'beef' },
      { name: 'Pesce', count: 2, icon: 'seafood' },
      { name: 'Verdure', count: 1, icon: 'vegetable' },
      { name: 'Panificazione', count: 1, icon: 'bread' },
    ],
  },
]

export const sharedDownloads: DownloadGroup[] = [
  {
    title: 'Manuali',
    files: [
      { name: 'Manuale d’uso', details: 'PDF · 4,2 MB', icon: 'pdf' },
      { name: 'Manuale di installazione', details: 'PDF · 2,8 MB', icon: 'pdf' },
    ],
  },
  {
    title: 'Schede tecniche',
    files: [{ name: 'Scheda tecnica XEVC-1011', details: 'PDF · 1,1 MB', icon: 'pdf' }],
  },
  {
    title: 'Firmware',
    files: [
      { name: 'Firmware 4.12.3', details: 'ZIP · 38 MB', icon: 'folder' },
      { name: 'Note di rilascio', details: 'PDF · 0,4 MB', icon: 'pdf' },
    ],
  },
  {
    title: 'Altro',
    files: [{ name: 'Dichiarazione di conformità', details: 'PDF · 0,6 MB', icon: 'pdf' }],
  },
]
