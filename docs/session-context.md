# DDC Oven Page Prototype — Context for a new session

Read this first, then wait for the user to explain the next scenario. Don't start building a scenario before the user describes it.

## Goal
An interactive, responsive prototype of UNOX DDC's redesigned **Oven page**, built from Figma. Desktop (1440px) and mobile (390px) share one codebase and should match Figma pixel for pixel. Scenarios are switched with data only, so no rebuild is needed for each one.

## Branches and deploy (important)
- **Repo:** `github.com/davidecester/demo-ddc-oven-page`.
- **Never push to `main`.** Cloudflare Workers Builds deploys every push to `main`, and **the user decides when to merge**.
- Work on a `claude/...` feature branch and push only there. The user merges it via a PR.
- One PR per scenario, stacked: PR #1 `claude/wonderful-turing-r4a56e` (Scenario 1, merged), PR #2 `claude/hopeful-pascal-y3fr0j` (Scenario 2 + AA colours), `claude/scenario-3-maintenance` (Scenario 3, based on PR #2), `claude/scenario-4-new-oven` (Scenario 4, based on Scenario 3).
- Scenario switcher labels are the user's scenario names: Scenario Base, Activity in Progress - Idle, Manutenzione Richiesta, Forno Appena Registrato. If PR #1 is still open, start from that branch so you have the Scenario 1 changes. If it's merged, start from `main`.
- **Commit identity:** Davide Cester <cesterdav@gmail.com>.
- **Language:** UI copy in Italian. Code and commit messages in English. Nav labels stay in English.

## Status
- **Scenario 1 (cooking)** is complete, pixel-matched at 1440 and 390, and passes build, lint and axe.
- These changes are on the PR #1 branch:
  - The overview activity tag ("Cottura in corso") is an `<a href="#attivita-in-corso">` to the Attività in corso card. The anchor id is in `src/components/oven/anchors.ts`, and `.anchor-target` sets a scroll-margin of 120px on mobile and 144px on desktop for the sticky TopBar.
  - **SENSE.Klean chart scrubbing (Revolut-style):** hovering or tapping a bar updates the header's %, level label, colour, icon and time ("Oggi/Ieri alle HH:MM"). Leaving the chart or tapping outside resets it to the current reading. The levels are:
    - Pulito: primary black text, no icon.
    - Sporco: `text-yellow-500` with the warning icon.
    - Molto Sporco: `text-alarm` with the red "!" error icon (`dirt-error-32/20.svg`).
    - Thresholds: ≤50 clean, ≤75 dirty, otherwise veryDirty (`senseKlean.ts`).
- **Scenario 2 (idle, `?scenario=idle`)** is done in `src/data/scenarios/idle.ts`. It reuses Scenario 1 and overrides the activity (idle, 78% · Molto Sporco), the critical alert "Camera Molto Sporca" (WF54) and the SENSE.Klean reading (78% at 13:00).
  - Critical alerts use `bg-alarm-16` (`--color-alarm-16`), the `sheet-error` icon and a red dot (`dot-red`) on the "+N altri avvisi" row.
  - The idle CTA has the washing icon and is full width when stacked. The idle icon slot is 100px stacked and 200px beside the details.
- **Scenario 3 (maintenance, `?scenario=maintenance`)** is done in `src/data/scenarios/maintenance.ts`: idle at 0% · Pulito with a "Scegli una ricetta" CTA (link to the Ricette card, `#ricette`), a critical "Manutenzione richiesta" (MN02) and a warning "Consumabili detergenti" (CD04) alert, and the `maintenance` image tag.
  - The overview "Manutenzione richiesta" tag links to the Avvisi card (`#avvisi`). Anchor ids are in `anchors.ts`.
  - Alert actions carry their own icon (`AlertAction.icon`); an alert can override its badge glyph (`badgeIcon`). Idle CTAs are `IdleActivity.cta` (`startWashing` or `chooseRecipe`).
  - "N richiede/richiedono azione" is pluralised.
  - "Pianifica manutenzione" and "Ordina consumabili" close the drawer and show a confirmation toast (`src/components/ui/Toast.tsx`, prototype-only). The overview counts alerts from the data: "Avvisi: 4" (Figma's "3" is a copy mistake, confirmed by the user).
- **Scenario 4 (new oven, `?scenario=new-oven`)** is done in `src/data/scenarios/newOven.ts`: "Nuovo Forno", 0 h, no alerts (no Avvisi card; overview shows "Avvisi: -"), idle at 0% with "Scegli una ricetta", full RO.Care filter (100%, 365 giorni, 4 unità).
  - Empty data uses `EmptyData` (`src/components/ui/EmptyData.tsx`): the card's normal layout faded (charts 30%, usage rows 20%), `aria-hidden`, with "Nessun dato ancora disponibile" on top. Trend: `activityTrend: null`. SENSE.Klean: `hourly: []`, `readAt: null`. Usage: `categories: []`.
  - Recipes: tabs with no categories show "Nessuna ricetta caricata" and "Crea un Gruppo" (toast).
  - **Open:** axe flags the faded placeholder text (decorative and `aria-hidden`, but low contrast by design). Figma's breadcrumb says "Academy 5"; the code uses the oven name ("Nuovo Forno"). Figma mobile shows real hours/percentages in the faded rows; the code uses the desktop "- h" / "- min · 0%".
- **All four scenarios are done.**
- **Decided:** no floating tooltip on the SENSE.Klean chart; 0% (wash) bars read "Pulito"; the 78% frame belongs to Scenario 2.

## Stack
- Vite 8, React 19, TypeScript, Tailwind 4 and Recharts 3. Node 22. Lint is oxlint. No component library.
- Run `npm ci` first in a fresh container. Without it, build and lint fail.
- Scripts: `npm run dev`, `npm run build` (tsc + vite build), `npm run lint`, `npm run preview`.
- **Tokens** are in `src/styles/tokens.css`, for example `--color-alarm`, `--color-accent #006fd9`, `--color-green-500 #008a00` and `--color-yellow-500`.
- **Text styles** are `@utility type-*` in `src/styles/typography.css`. State-layer and mask-icon utilities are in `src/styles/states.css`.
- **Assets** are in `/public/assets` (icons in `/public/assets/icons`).
- **Fonts:** Roboto, plus Montserrat for ring percentages.
- **Breakpoints:** md 768, lg 1024, xl 1440. The sticky TopBar is 104px high below 1024 and 128px at 1024 and above.

## Architecture
- **Scenario model:** `src/types/oven.ts`. A `null` section renders that card's empty state, which is how the newly registered oven works.
- **Scenario data:** `src/data/scenarios/*.ts`, one file per scenario, registered in `index.ts`. Only `cooking.ts` exists so far.
- **Switching:** `?scenario=<id>` selects a scenario. A magenta "Prototipo" pill (ScenarioSwitcher, bottom left) switches between them.
- **`useOvenSimulation`** drives the live behaviour:
  - The countdown and progress ring run off the remaining time.
  - Chamber temperature heats from 185 to 190 °C (red `#b30024` while heating, green `#008a00` at target).
  - "Avvia lavaggio" switches to washing for 75 minutes and disables the CTAs.
- **Alerts** open in a bottom sheet with a scrim, focus trap, and Esc/scrim/✕ to close.
- **Recipe tabs** work with click and the arrow keys. Container queries switch the ring layout when the card is 520px wide.
- **Cards** are in `src/components/oven/`. `Card` (in `src/components/ui/Card.tsx`) accepts an `id` prop for anchors.

## Layout and grid
- **Mobile:** 4 columns, 16 margin, 8 gutter. **Tablet:** 8 columns, 24 margin, 16 gutter. **Desktop:** 12 columns, 24 margin, 16 gutter, plus a 94px sidebar.
- **Desktop card heights at 1440:** 348 / 280 / 347 / 347 / 478 / 428 / 428 / 232 / 220.
- Browser chrome and the iOS status bar are left out.

## Figma
- File key `1bn8wNuEBinpGhweOO9f0Y`, page "Copia per Prototipo" (`35804:2011`):
  - Scenario Base `35807:8455`: desktop `35807:8456`, mobile `35807:9057`, desktop sheet `35807:8975`, mobile sheet `35807:9014`.
  - Activity in Progress - Idle: `35807:9479`
  - SENSE.Klean header states: `35807:9758`
  - Manutenzione Richiesta: `35807:10539`
  - Forno Appena Registrato: `35807:11672`
- Component page `35707:297`: Activity Card variants (Desktop/Mobile × Cooking/Washing/Standby), the Status Tag set (9 variants) and the Progress Ring.
- **How to use the Figma MCP:**
  - Load the `figma-design-to-code` skill before calling `get_design_context`.
  - `get_design_context` and `get_screenshot` read designs.
  - Downloading assets from `https://www.figma.com/api/mcp/asset/...` needs `www.figma.com` allowed in the environment's network access. If downloads return 403, ask the user to allow the domain or to export the assets and upload them. Don't redraw assets unless the user agrees.
- Copy must match Figma exactly. Times use a colon.

## Accessibility
- **Fixed for AA:**
  - Background-tertiary is `#ebebeb` instead of `#dfe0e1` everywhere (page background and info alert badge).
  - Green-500 is `#008a00` instead of `#008f00` everywhere (token, temperature text, RO.Care ring, green SVG icons).
  - Accent is `#006fd9` instead of `#0073e1` everywhere (token, buttons, links, active nav, chart highlight, focus ring, accent SVG icons).
  - Grey-300 is `#707070` instead of `#cccccc` everywhere (search placeholder, SENSE.Klean and "Altro" bars).
  - Alarm red is `#e6002e` instead of Figma's `#ff0033` **everywhere**: the `--color-alarm` token and every SVG icon that used `#FF0033`. White text on it and it as text on white are both 4.77:1.
  - Critical alert surface (`--color-alarm-16`) is the alarm at 10% instead of 16%, so grey text on it is 4.6:1.
  - **Rule:** when a colour changes for accessibility, change it everywhere it is used (tokens and SVG fills), then check every pairing.
  - The avatar's accessible name starts with its visible initials ("EG, profilo utente").


## Verification (before every push)
1. Run `npm run build` and `npm run lint`.
2. Run `npx vite preview --port 4173`, then check with Playwright at 1440×900 and 390×844. Playwright is preinstalled (`/opt/node-tools/node_modules/playwright`, Chromium at `/opt/pw-browsers`). Check:
   - The interactions you changed.
   - No horizontal overflow (`scrollWidth <= innerWidth`).
   - An axe-core audit. Install `axe-core` in the scratchpad and inject `axe.min.js`. Expect no violations.
3. Compare screenshots against Figma at both widths.
4. Don't `pkill -f` with a pattern that appears in the same shell command line, because it kills the shell. Stop the preview server separately.
5. Push to the feature branch only, then tell the user what changed. They merge to `main` when ready.
