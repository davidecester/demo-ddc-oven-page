import type { Scenario } from '../../types/oven'
import { assetUrl } from '../../utils/assets'
import { sharedDownloads, sharedRecipes } from '../shared'

/** Scenario 1 — oven online, cooking in progress (Figma: "Scenario Base"). */
export const cookingScenario: Scenario = {
  id: 'cooking',
  label: '1 · Cottura in corso',
  startsAt: '2026-10-12T12:26:00',
  washingCycle: { label: 'Lavaggio in corso', totalDurationSec: 75 * 60 },

  oven: {
    modelLine: 'CHEFTOP MIND.Maps™ PLUS',
    name: 'Academy 5',
    group: 'UNOX',
    connection: 'online',
    warranty: 'Garanzia LONG.Life: Attiva fino al 03/2028',
    usageHours: '3.482 h',
    serialNumber: '2309-AX-004871',
    productCode: 'XEVC-1011-E1RM',
    firmware: '4.12.3',
    image: {
      src: assetUrl('images/oven-academy.png'),
      alt: 'Forno UNOX CHEFTOP MIND.Maps PLUS, vista frontale',
    },
  },

  // 68% done with 1 h 16 min left → 13:42 end time from a 12:26 start.
  activity: {
    status: 'cooking',
    recipe: 'Pollo arrosto – Programma 12',
    totalDurationSec: 14250,
    remainingSec: 4560,
    chamberTempC: 185,
    targetTempC: 190,
  },

  alerts: [
    {
      id: 'camera-sporca',
      severity: 'warning',
      title: 'Camera Sporca',
      description: 'Consigliato lavaggio prima della prossima cottura.',
      code: 'WF53',
      timestamp: '09/10/2026 18:30',
      action: { type: 'startWashing', label: 'Avvia lavaggio', icon: 'washing-white' },
    },
    {
      id: 'firmware',
      severity: 'info',
      title: 'Aggiornamento firmware',
      description: 'Il firmware 4.12.3 è stato installato correttamente.',
      timestamp: '08/10/2026 09:15',
    },
    {
      id: 'sync',
      severity: 'info',
      title: 'Sincronizzazione dati',
      description: 'I dati di utilizzo e le ricette sono stati sincronizzati con successo.',
      timestamp: '07/10/2026 23:55',
    },
  ],

  // Hours derived from the Figma bar heights (136 px = 12 h).
  activityTrend: [
    { day: 'Lun', cooking: 6.35, washing: 1.6, standby: 8.5 },
    { day: 'Mar', cooking: 6.9, washing: 2.1, standby: 8.5 },
    { day: 'Mer', cooking: 5.8, washing: 1.6, standby: 9.5 },
    { day: 'Gio', cooking: 6.35, washing: 2.1, standby: 8.5 },
    { day: 'Ven', cooking: 7.4, washing: 1.6, standby: 9.5 },
    { day: 'Sab', cooking: 6.9, washing: 2.1, standby: 8.5 },
    { day: 'Dom', cooking: 5.3, washing: 1.6, standby: 9.5 },
  ],

  // Values from the Figma bar heights; the drops to 0 at 00:00 and 07:00 are washes.
  senseKlean: {
    current: 62,
    readAt: 'Oggi alle 13:00',
    hourly: [
      { hour: '14:00', value: 38 },
      { hour: '15:00', value: 41 },
      { hour: '16:00', value: 43 },
      { hour: '17:00', value: 47 },
      { hour: '18:00', value: 55 },
      { hour: '19:00', value: 63 },
      { hour: '20:00', value: 71 },
      { hour: '21:00', value: 78 },
      { hour: '22:00', value: 82 },
      { hour: '23:00', value: 84 },
      { hour: '00:00', value: 0 },
      { hour: '1:00', value: 12 },
      { hour: '2:00', value: 18 },
      { hour: '3:00', value: 31 },
      { hour: '4:00', value: 46 },
      { hour: '5:00', value: 59 },
      { hour: '6:00', value: 75 },
      { hour: '7:00', value: 0 },
      { hour: '8:00', value: 15 },
      { hour: '9:00', value: 25 },
      { hour: '10:00', value: 38 },
      { hour: '11:00', value: 46 },
      { hour: '12:00', value: 55 },
      { hour: '13:00', value: 62 },
    ],
  },

  roCare: {
    status: 'good',
    lifePercent: 74,
    remainingDuration: '128 giorni',
    remainingUnits: '2',
    waterHardness: '18 °f',
    installedAt: '12/03/2026',
    updatedAt: '10/10/2026 12:05',
    helpLink: '#',
  },

  usage: {
    total: '42 h 30 min',
    categories: [
      { key: 'cookingSet', label: 'Cooking Set', duration: '18 h', percent: 42 },
      { key: 'programs', label: 'Programmi', duration: '11 h 30 min', percent: 27 },
      { key: 'chefunox', label: 'CHEFUNOX', duration: '6 h', percent: 14 },
      { key: 'multiTime', label: 'MULTI.Time', duration: '5 h', percent: 12 },
      { key: 'other', label: 'Altro', duration: '2 h', percent: 5 },
    ],
  },

  recipes: sharedRecipes,
  downloads: sharedDownloads,
}
