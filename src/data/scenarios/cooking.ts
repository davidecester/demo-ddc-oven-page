import type { Scenario } from '../../types/oven'
import { assetUrl } from '../../utils/assets'
import { CHAMBER_MESSAGES, sharedDownloads, sharedRecipes } from '../shared'

/** Scenario 1 — oven online, cooking in progress (Figma: "Scenario Base"). */
export const cookingScenario: Scenario = {
  id: 'cooking',
  label: 'Base Scenario',
  startsAt: '2026-10-12T13:05:00',
  washingCycle: { label: 'Washing in progress', totalDurationSec: 75 * 60 },

  oven: {
    modelLine: 'CHEFTOP MIND.Maps™ PLUS',
    name: 'Academy 5',
    group: 'UNOX',
    connection: 'online',
    warranty: { label: 'LONG.Life warranty:', value: 'Active until 03/2028' },
    usageHours: '3,482 h',
    serialNumber: '2309-AX-004871',
    productCode: 'XEVC-1011-E1RM',
    firmware: '4.12.3',
    image: {
      src: assetUrl('images/oven-academy.png'),
      alt: 'UNOX CHEFTOP MIND.Maps PLUS oven, front view',
    },
  },

  // 68% done with 1 h 16 min left → 14:21 end time from a 13:05 start (after the 13:00 SENSE.Klean reading).
  activity: {
    status: 'cooking',
    recipe: 'Roast chicken – Program 12',
    totalDurationSec: 14250,
    remainingSec: 4560,
    chamberTempC: 185,
    targetTempC: 190,
  },

  alerts: [
    {
      id: 'dirty-chamber',
      severity: 'warning',
      title: CHAMBER_MESSAGES.dirty.title,
      description: CHAMBER_MESSAGES.dirty.note,
      code: 'WF53',
      timestamp: '09/10/2026 18:30',
      // A wash can't start while cooking: queue it for the end of the cycle instead
      action: { type: 'scheduleWashing', label: 'Schedule washing', doneLabel: 'Washing scheduled', icon: 'washing-white' },
    },
    {
      id: 'firmware',
      severity: 'info',
      title: 'Firmware update',
      description: 'Firmware 4.12.3 was installed successfully.',
      timestamp: '08/10/2026 09:15',
    },
    {
      id: 'sync',
      severity: 'info',
      title: 'Data sync',
      description: 'Usage data and recipes were synced successfully.',
      timestamp: '07/10/2026 23:55',
    },
  ],

  // Hours derived from the Figma bar heights (136 px = 12 h).
  activityTrend: [
    { day: 'Mon', cooking: 6, washing: 1.6, standby: 8.5 },
    { day: 'Tue', cooking: 6.5, washing: 2.1, standby: 8.5 },
    { day: 'Wed', cooking: 5.5, washing: 1.6, standby: 9.5 },
    { day: 'Thu', cooking: 6, washing: 2.1, standby: 8.5 },
    { day: 'Fri', cooking: 7, washing: 1.6, standby: 9.5 },
    { day: 'Sat', cooking: 6.5, washing: 2.1, standby: 8.5 },
    { day: 'Sun', cooking: 5, washing: 1.6, standby: 9.5 },
  ],

  // Values from the Figma bar heights; the drops to 0 at 00:00 and 07:00 are washes.
  senseKlean: {
    current: 62,
    readAt: 'Today at 13:00',
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
      { hour: '01:00', value: 12 },
      { hour: '02:00', value: 18 },
      { hour: '03:00', value: 31 },
      { hour: '04:00', value: 46 },
      { hour: '05:00', value: 59 },
      { hour: '06:00', value: 75 },
      { hour: '07:00', value: 0 },
      { hour: '08:00', value: 15 },
      { hour: '09:00', value: 25 },
      { hour: '10:00', value: 38 },
      { hour: '11:00', value: 46 },
      { hour: '12:00', value: 55 },
      { hour: '13:00', value: 62 },
    ],
  },

  roCare: {
    status: 'good',
    lifePercent: 74,
    remainingDuration: '128 days',
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
      { key: 'programs', label: 'Programs', duration: '11 h 30 min', percent: 27 },
      { key: 'chefunox', label: 'CHEFUNOX', duration: '6 h', percent: 14 },
      { key: 'multiTime', label: 'MULTI.Time', duration: '5 h', percent: 12 },
      { key: 'other', label: 'Other', duration: '2 h', percent: 5 },
    ],
  },

  recipes: sharedRecipes,
  downloads: sharedDownloads,
}
