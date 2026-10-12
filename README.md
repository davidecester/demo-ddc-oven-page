# DDC Oven page – interactive prototype

Clickable, responsive prototype of the redesigned **Oven page** of UNOX **Data Driven Cooking** (DDC), built from the Figma file *Esercizio Unox – Davide Cester* (page "Copia per Prototipo").
It is a prototype: mock data, no backend. UI copy is Italian, as in Figma.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS 4 · Recharts (bar charts)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build in dist/
npm run lint
```

Open a specific state with `?scenario=<id>`, e.g. `http://localhost:5173/?scenario=cooking`.
The floating **Prototipo** pill (bottom left) switches scenario and restarts the live simulation. It's a prototype tool, not part of the design.

## What's interactive

- **Live cooking:** the countdown ticks every second, the progress ring follows it, and the chamber temperature heats to the target (red → green when reached).
- **Avvia lavaggio** (alert banner or alerts sheet) switches the activity card to the *Lavaggio* variant and the overview tag to *Lavaggio in corso*.
- **"+2 altri avvisi"** and **"Avvisi: 3"** open the *Tutti gli avvisi* bottom sheet (Esc, ✕ or scrim to close; focus is trapped inside).
- Recipe tabs (click or ←/→), chart tooltips on hover/tap, hover/focus/pressed states everywhere.
- Navigation, downloads and other DDC links look clickable but go nowhere.

## Project structure

```
src/
  styles/          design tokens (tokens.css), text styles (typography.css), interaction states
  types/oven.ts    data model: Scenario, Activity, OvenAlert, …
  data/scenarios/  one file per scenario + registry (index.ts)
  data/shared.ts   content shared between scenarios (recipes, downloads)
  hooks/           live simulation, ?scenario= URL sync, media query
  components/ui/       primitives: Card, StatusTag, Button, ProgressRing, BottomSheet, Icon…
  components/oven/     page sections (one per card)
  components/layout/   sidebar, top bar, bottom nav
  components/prototype ScenarioSwitcher
  pages/OvenPage.tsx   page grid (4 / 8 / 12 columns)
public/assets/     icons (SVG) and images exported from Figma
```

Components render purely from data. Stateful parts take a typed state:
`Activity.status: 'cooking' | 'washing' | 'idle'`, `StatusTagType` (all 9 Figma tag variants), `AlertSeverity: 'critical' | 'warning' | 'info'`, `RoCare.status: 'good' | 'exhausted'`, and the SENSE.Klean level is derived from the value (`clean | dirty | veryDirty`).
Any section set to `null` renders that card's empty state.

## Add a scenario

1. Copy `src/data/scenarios/cooking.ts` to e.g. `idle.ts`, rename the export, set a unique `id` and `label`.
2. Change the data. For example: `activity: { status: 'idle', label: 'In attesa', dirtLevel: '78% · Molto Sporco', suggestWashing: true, hint: '…' }`, set `oven.extraTags: ['maintenance']`, add a `critical` alert, or set `usage: null` for an empty card.
3. Register it in `src/data/scenarios/index.ts` → it appears in the switcher and at `?scenario=idle`.

If the new Figma frame introduces a new visual state, add it to the matching config map (e.g. `DIRT_LEVEL` in `components/oven/senseKlean.ts`, `TAG_STYLES` in `components/ui/StatusTag.tsx`) rather than to the component markup.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
The Vite `base` comes from the repository name automatically (`BASE_PATH=/<repo>/`), so renaming the repo needs no code change.
