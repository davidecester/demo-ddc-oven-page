import { useCallback, useEffect, useState } from 'react'
import type { Activity, IdleActivity, Scenario } from '../types/oven'
import { formatEndedAt } from '../utils/format'

const TICK_MS = 1000
/** Chamber heats by 1 °C every 4 s until it reaches the target, then holds within +1 °C. */
const HEAT_SECONDS_PER_DEGREE = 4

/** Live, derived state of the activity card. */
export type LiveActivity =
  | {
      status: 'cooking'
      recipe: string
      progress: number
      remainingSec: number
      endsAt: Date
      chamberTempC: number
      targetTempC: number
      targetReached: boolean
    }
  | {
      status: 'washing'
      label: string
      progress: number
      remainingSec: number
      endsAt: Date
    }
  | {
      status: 'idle'
      label: string
      /** e.g. { label: 'Last cooking ended', value: 'Today at 12:40 · 25 min ago' } */
      lastActivity: { label: string; value: string } | null
      dirtLevel: string | null
      ctas: IdleActivity['ctas']
      hint: string | null
      notice: IdleActivity['notice']
    }

interface SimulationState {
  /** Activity as defined when it started (scenario data, or the wash started by the user). */
  activity: Activity
  /** Real time (ms) when `activity` started being simulated. */
  startedAtMs: number
}

function deriveLive(state: SimulationState, scenarioStart: Date, sceneStartMs: number, nowMs: number): LiveActivity {
  const { activity, startedAtMs } = state
  const elapsedSec = Math.max(0, (nowMs - startedAtMs) / 1000)
  // Simulated wall clock: scenario start time + real time elapsed since the page loaded
  const simNow = new Date(scenarioStart.getTime() + (nowMs - sceneStartMs))

  switch (activity.status) {
    case 'cooking': {
      const remainingSec = Math.max(0, activity.remainingSec - elapsedSec)
      const progress = (1 - remainingSec / activity.totalDurationSec) * 100
      const heated = activity.chamberTempC + Math.floor(elapsedSec / HEAT_SECONDS_PER_DEGREE)
      const targetReached = heated >= activity.targetTempC
      // Once at target the reading wobbles between target and target + 1, like a real probe
      const chamberTempC = targetReached
        ? activity.targetTempC + (Math.floor(elapsedSec / 7) % 3 === 0 ? 1 : 0)
        : heated
      return {
        status: 'cooking',
        recipe: activity.recipe,
        progress,
        remainingSec,
        endsAt: new Date(simNow.getTime() + remainingSec * 1000),
        chamberTempC,
        targetTempC: activity.targetTempC,
        targetReached,
      }
    }
    case 'washing': {
      const remainingSec = Math.max(0, activity.remainingSec - elapsedSec)
      return {
        status: 'washing',
        label: activity.label,
        progress: (1 - remainingSec / activity.totalDurationSec) * 100,
        remainingSec,
        endsAt: new Date(simNow.getTime() + remainingSec * 1000),
      }
    }
    case 'idle':
      return {
        status: 'idle',
        label: activity.label,
        lastActivity: activity.lastActivity && {
          label: activity.lastActivity.status === 'cooking' ? 'Last cooking ended' : 'Last washing ended',
          value: formatEndedAt(new Date(activity.lastActivity.endedAt), simNow),
        },
        dirtLevel: activity.dirtLevel,
        ctas: activity.ctas,
        hint: activity.hint,
        notice: activity.notice,
      }
  }
}

/**
 * Drives the "real-time" feel: countdowns tick every second, the chamber heats
 * towards its target, and "Avvia lavaggio" switches the activity to a wash cycle.
 */
export function useOvenSimulation(scenario: Scenario) {
  const [sceneStartMs] = useState(() => Date.now())
  const [state, setState] = useState<SimulationState>(() => ({
    activity: scenario.activity,
    startedAtMs: Date.now(),
  }))
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  const startWashing = useCallback(() => {
    setState((prev) =>
      prev.activity.status === 'washing'
        ? prev
        : {
            activity: {
              status: 'washing',
              label: scenario.washingCycle.label,
              totalDurationSec: scenario.washingCycle.totalDurationSec,
              remainingSec: scenario.washingCycle.totalDurationSec,
            },
            startedAtMs: Date.now(),
          },
    )
  }, [scenario.washingCycle])

  const live = deriveLive(state, new Date(scenario.startsAt), sceneStartMs, nowMs)

  return { live, startWashing }
}
