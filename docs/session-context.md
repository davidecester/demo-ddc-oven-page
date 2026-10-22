# DDC Oven Page Prototype — Context for a new session

Read this first, then wait for the user to explain the next scenario. Don't start building a scenario before the user describes it.

## Goal
An interactive, responsive prototype of UNOX DDC's redesigned **Oven page**, built from Figma. Desktop (1440px) and mobile (390px) share one codebase and should match Figma pixel for pixel. Scenarios are switched with data only, so no rebuild is needed for each one.

## Branches and deploy (important)
- **Repo:** `github.com/davidecester/demo-ddc-oven-page`.
- **Never push to `main`.** Cloudflare Workers Builds deploys every push to `main`, and **the user decides when to merge**.
- Work on a `claude/...` feature branch and push only there. The user merges it via a PR.
- **Use one working branch for all further updates: `claude/prototype-updates`.** Don't use any other branch name. Push there and keep one PR open into `main`; the user checks it and merges.
- **GitHub auto-deletes the branch after a merge.** So before starting an update:
  1. `git fetch origin main claude/prototype-updates`.
  2. If `origin/claude/prototype-updates` still exists and its PR is open, keep working on it (merge `main` in if it's behind).
  3. If it's gone (or its PR is merged), recreate it from the latest main: `git checkout -B claude/prototype-updates origin/main`, then push with `git push -u origin claude/prototype-updates`. Never stack new work on already-merged history.
  4. Open a new PR into `main` for the recreated branch (the old merged PR can't be reused).
- History: PRs #1–#9 (Scenarios 1–4, accessibility, spacing, shadows, scenario switcher) are all merged into `main`. Their branches (`claude/wonderful-turing-r4a56e`, `claude/hopeful-pascal-y3fr0j`, `claude/scenario-3-maintenance`, `claude/scenario-4-new-oven`) have been deleted from GitHub; only `main` and `claude/prototype-updates` remain.
- Scenario switcher labels are the user's scenario names: Scenario Base, Activity in Progress - Idle, Manutenzione Richiesta, Forno Appena Registrato.
- When the user asks to see an option first, show a preview and wait for an explicit choice before building.
- **Commit identity:** Davide Cester <cesterdav@gmail.com>.
- **Language (decided 21 Oct 2026):** the prototype is **English only**, while the Figma file stays Italian. Every string is an English translation of the Figma copy, so match Figma's structure and meaning, not its words. Code and commit messages are in English. Sentence case for labels and alert titles. Dates DD/MM/YYYY, 24 h times, English number formats ("3,482 h", "4.2 MB").
  - Glossary: Avvisi = Alerts, "+N altri avvisi" = "+N more alerts", Tutti gli avvisi = All alerts, Azione richiesta = Action required, Informazioni e cronologia = Information and history, Critico / Attenzione = Critical / Warning, Attività in corso = Current activity, Cottura (in corso) = Cooking (in progress), Lavaggio (in corso) = Washing (in progress), In attesa = Idle, Camera sporca / molto sporca = Dirty / Very dirty chamber, Pulito / Sporco / Molto sporco = Clean / Dirty / Very dirty, Oggi / Ieri alle = Today / Yesterday at, Mostra / Nascondi informazioni = Show / Hide details, Andamento attività = Activity trend, Ore di utilizzo totali = Total usage hours, Ricette presenti nel forno = Recipes on the oven, Area download = Downloads, Filtro RO.Care = RO.Care filter, Detergenti quasi esauriti = Detergents running low, Ordina detergenti = Order detergents, Pianifica manutenzione = Schedule maintenance, Avvia lavaggio = Start washing, Scegli una ricetta = Choose a recipe, Crea un gruppo = Create a group. Scenario names: Base Scenario, Activity in Progress - Idle, Maintenance Required, Newly Registered Oven (oven "New Oven"). Product names (SENSE.Klean, MULTI.Time, MISE.EN.PLACE, CHEFUNOX, Cooking Set, LONG.Life, CHEFTOP MIND.Maps) are never translated.
  - Anchor ids are English: `#alerts`, `#current-activity`, `#recipes`.
  - The nav labels ("Ovens", "Dashboard", …) and the "Search" placeholder were already English. Rule: the search placeholder always follows the nav labels' language; translate them together or not at all.

## Status
- **Oven overview card (new design, all scenarios):** Figma component `37704:4165`. Mobile: image 200px high with the tags laid over its top (absolute, 16px from the card edge); desktop: 301px image column, tags as the first row of the info. Tags row (size M, 28px pills with a 14px `type-label-sm` label and 16px icon: `StatusTag size="md"`; decided by the user: the pill shape and bigger label mark them as clickable chips, while the read-only S tags are 24px with a 4px radius and a 12px label), in this order:
  1. Neutral count `alertCount` (blue-100, bell, number only) = the other alerts (all alerts minus the one named next). Hidden when 0. Screen readers hear "N altri avvisi". Links to `#avvisi`.
  2. The most severe alert by name, only for critical or warning, in the **same two styles as the alert banners** (decided by the user to reduce tag colours): `critical` = solid alarm `#e6002e`, white text + white error icon (4.7:1); `warning` = solid yellow-400 `#ffc107`, black text + black warning icon (12.9:1). So "Dirty chamber" is Warning; "Very dirty chamber" and "Maintenance required" are Critical. Solid, so they stay readable over the image. Links to `#avvisi`. This replaced the old "Manutenzione richiesta" extra tag.
  3. The activity tag (links to `#attivita-in-corso`), or "Forno offline".
  Then model line, name + 10px status dot (no "Online" text; it's in `sr-only`) and Gruppo. "Mostra informazioni / Nascondi informazioni" (`aria-expanded`) reveals warranty + the 2×2 info grid with a 300 ms grid-rows transition; on desktop the image column stretches with it. Heights: desktop 234 closed / 374 open, mobile 390 / 530 in every scenario (wrapped tags overlay the image).
  - Tag padding is the Figma value minus the 1px border (Figma strokes are inside): S `px-[7px] py-[3px]`, M `px-[11px] py-[5px]`.
  - **Decided (a11y):** no yellow is used as text or icon colour any more (Figma's `#b38705` failed, and any yellow that passes 3:1 on white looks ochre). Warning yellow appears only as the yellow-400 `#ffc107` tag surface with black text (12.9:1); the `yellow-500` token and the yellow dirt icons were removed. The multicolour food illustrations keep their Figma colours.
- **Avvisi card:** the "+N more alerts" row is plain text + chevron (no severity dot, removed by the user for a cleaner row). The idle "In attesa" tag is grey-200 `#e0e0e0` everywhere. Alert titles are sentence case ("Camera sporca", "Camera molto sporca").
- **Scenario 1 (cooking)** is complete, pixel-matched at 1440 and 390, and passes build, lint and axe.
- Scenario 1 details (merged):
  - The overview activity tag ("Cottura in corso") is an `<a href="#attivita-in-corso">` to the Attività in corso card. The anchor id is in `src/components/oven/anchors.ts`, and `.anchor-target` sets a scroll-margin of 120px on mobile and 144px on desktop for the sticky TopBar.
  - **SENSE.Klean chart scrubbing (Revolut-style):** hovering or tapping a bar updates the header's %, level tag and time ("Today/Yesterday at HH:MM"). Leaving the chart or tapping outside resets it to the current reading. The levels (`DIRT_LEVEL` in `senseKlean.ts`):
    - Clean: black value only, no tag (the level is in `sr-only`).
    - Dirty: black value + S `warning` tag "Dirty".
    - Very dirty: black value + S `critical` tag "Very dirty".
    - Thresholds: ≤50 clean, ≤75 dirty, otherwise veryDirty (`senseKlean.ts`).
- **Scenario 2 (idle, `?scenario=idle`)** is done in `src/data/scenarios/idle.ts`. It reuses Scenario 1 and overrides the activity (idle, 78% · Molto Sporco), the critical alert "Camera molto sporca" (WF54) and the SENSE.Klean reading (78% at 13:00).
  - Critical alerts use `bg-alarm-16` (`--color-alarm-16`) and the `sheet-error` icon.
  - The idle CTA has the washing icon and is full width when stacked. The idle icon slot is 100px stacked and 200px beside the details.
- **Scenario 3 (maintenance, `?scenario=maintenance`)** is done in `src/data/scenarios/maintenance.ts`: idle at 0% · Pulito with a "Scegli una ricetta" CTA (link to the Ricette card, `#ricette`), a critical "Manutenzione richiesta" (MN02) and a warning "Detergenti quasi esauriti" (CD04, CTA "Ordina detergenti", toast "Ordine detergenti inviato"; chosen by the user over Figma's "Consumabili detergenti" for a stronger scent) alert, and the `maintenance` image tag.
  - The overview "Manutenzione richiesta" tag links to the Avvisi card (`#avvisi`). Anchor ids are in `anchors.ts`.
  - The Avvisi card shows a banner for every alert that needs action (critical and warning, stacked 4px apart), then "+N altri avvisi" for the informational ones (Figma `35811:16206` desktop, `35811:16853` mobile).
  - Alert actions carry their own icon (`AlertAction.icon`); an alert can override its badge glyph (`badgeIcon`). Idle CTAs are `IdleActivity.cta` (`startWashing` or `chooseRecipe`).
  - "N richiede/richiedono azione" is pluralised.
  - "Pianifica manutenzione" and "Ordina consumabili" close the drawer and show a confirmation toast (`src/components/ui/Toast.tsx`, prototype-only). The overview counts alerts from the data: "4 Avvisi".
- **Scenario 4 (new oven, `?scenario=new-oven`)** is done in `src/data/scenarios/newOven.ts`: "Nuovo Forno", 0 h, no alerts (no Avvisi card and no Avvisi tag in the overview), idle at 0% with "Scegli una ricetta", full RO.Care filter (100%, 365 giorni, 4 unità).
  - Empty data uses `EmptyData` (`src/components/ui/EmptyData.tsx`): the card's normal layout faded (charts 30%, usage rows 20%), `aria-hidden`, with "Nessun dato ancora disponibile" on top. Trend: `activityTrend: null`. SENSE.Klean: `hourly: []`, `readAt: null`. Usage: `categories: []`.
  - Recipes: tabs with no categories show "Nessuna ricetta caricata" and "Crea un Gruppo" (toast).
  - **Decided:** the faded placeholder text stays as in Figma even though axe flags its contrast (decorative, `aria-hidden`; the only expected axe finding, Scenario 4 only). The breadcrumb uses the oven name ("Nuovo Forno"). The faded rows use "- h" / "- min · 0%" on both widths (the user fixed the Figma mobile frame to match).
- **All four scenarios are done.**
- **Recipes:** each tab has its own categories (`src/data/shared.ts`), with icons from the Figma "Chefunox food categories" frame (`3545:232623`). Programmi: Manzo, Pesce, Verdure, Panificazione. MULTI.Time: Pollo, Pizza, Snack surgelati, Panini. MISE.EN.PLACE: Uova, Pasta sfoglia, Dessert, Toast. The count uses "1 ricetta" / "N ricette".
- **Figma audit follow-up (21 Oct 2026, done):** two-digit hours on the SENSE.Klean axis (`02:00`); Base "now" is 13:05, so the cooking ends at 14:21 and the 13:00 reading isn't in the future; the Activity trend cooking hours add up to 42.5 h (6 · 6.5 · 5.5 · 6 · 7 · 6.5 · 5), matching the 42 h 30 min usage total; Idle hint = washing *required*; the new oven's RO.Care installation 21/10/2026, last update 21/10/2026 12:05; "0% · Clean" stays above "No data available yet" (decided).
- **SENSE.Klean value line (decided by the user, replaces the Figma "62% · Sporco · ⚠"):** the value in black (`type-heading-sm` mobile, `type-heading-xl` desktop), then the S Status Tag (Warning for Dirty, Critical for Very dirty) vertically centred on it, 8px apart; Clean shows the value only. The reading time sits on its own line below. Figma still needs this update.
- **Decided:** no floating tooltip on the SENSE.Klean chart; 0% (wash) bars read "Pulito"; the 78% frame belongs to Scenario 2.

## Stack
- Vite 8, React 19, TypeScript, Tailwind 4 and Recharts 3. Node 22. Lint is oxlint. No component library.
- Run `npm ci` first in a fresh container. Without it, build and lint fail.
- Scripts: `npm run dev`, `npm run build` (tsc + vite build), `npm run lint`, `npm run preview`.
- **Tokens** are in `src/styles/tokens.css`, for example `--color-alarm`, `--color-accent #006fd9`, `--color-green-500 #008a00`.
- **Text styles** are `@utility type-*` in `src/styles/typography.css`. State-layer and mask-icon utilities are in `src/styles/states.css`.
- **Assets** are in `/public/assets` (icons in `/public/assets/icons`).
- **Fonts:** Roboto, plus Montserrat for ring percentages.
- **Breakpoints:** md 768, lg 1024, xl 1440. The sticky TopBar is 104px high below 1024 and 128px at 1024 and above.

## Architecture
- **Scenario model:** `src/types/oven.ts`. A `null` section renders that card's empty state, which is how the newly registered oven works.
- **Scenario data:** `src/data/scenarios/*.ts`, one file per scenario, registered in `index.ts`: `cooking.ts`, `idle.ts`, `maintenance.ts`, `newOven.ts`.
- **Switching:** `?scenario=<id>` selects a scenario. A magenta "Prototipo" pill (ScenarioSwitcher) switches between them. Mobile: bottom left above the bottom nav. Desktop: bottom of the screen (16px), centred on the line between the sidebar and the content (`left: sidebar - 16px`), clear of the "Guide" button; when it expands it grows to the right, over the content. After load it shows dot + label for 6 s, then shrinks to a 32px dot. During the intro and while shrunk, a magenta ripple spreads from the dot (2.8x, from 90% opacity, every 1.2 s; the pill and dot keep their size); it stops while hovered, focused or open; hover (mouse), keyboard focus or an open panel expand it again; tapping outside closes the panel. Growing and shrinking are symmetric: the label animates via a grid 0fr→1fr transition over 450 ms ease-in-out, and the panel fades/slides in over 450 ms (`switcher-panel-in` in `states.css`). Behaviour is verified identical on desktop (mouse) and mobile (touch).
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
- **Shadows:** cards use `shadow-elevation-1` (matches Figma); the alerts drawer has no shadow.
- **Activity hint** (under the CTA): icon + text 4px apart (`gap-1`), centred.

## Figma
- **Current design (use this):** file key `FH7w3DPC1SqueKQXfsQzHk`, page "🖋️ Exercise" (`31703:201`). Desktop / mobile frames per scenario:
  - Scenario Base: desktop `37704:2240`, mobile `37704:2841`, sheets `37704:2759` / `37704:2798`.
  - Activity in Progress - Idle: desktop `37704:5820`, mobile `37704:6380`.
  - Manutenzione Richiesta: desktop `37704:8907`, mobile `37704:9537`.
  - Forno Appena Registrato: desktop `37704:10647`, mobile `37704:11180`.
  - Component "Oven-Overview-Card" `37704:4165` (Desktop/Mobile × Closed/Open).
- Older work copy (superseded): file key `1bn8wNuEBinpGhweOO9f0Y`, page "Copia per Prototipo" (`35804:2011`):
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
- Copy follows Figma's meaning, translated to English (see Language). Times use a colon.

## Accessibility
- **Fixed for AA:**
  - Background-tertiary is `#ebebeb` instead of `#dfe0e1` everywhere (page background and info alert badge).
  - Green-500 is `#008a00` instead of `#008f00` everywhere (token, temperature text, RO.Care ring, green SVG icons).
  - Accent is `#006fd9` instead of `#0073e1` everywhere (token, buttons, links, active nav, chart highlight, focus ring, accent SVG icons).
  - Grey-300 is `#707070` instead of `#cccccc` everywhere (search placeholder, SENSE.Klean and "Altro" bars).
  - Alarm red is `#e6002e` instead of Figma's `#ff0033` **everywhere**: the `--color-alarm` token and every SVG icon that used `#FF0033`. White text on it and it as text on white are both 4.77:1.
  - Online dot green-eco-400 is `#469d2a` instead of Figma's `#52ae32` (3.43:1 on white, WCAG 1.4.11), since it is the only visible online cue. It is only used for that dot.
  - Critical alert surface (`--color-alarm-16`) is the alarm at 10% instead of 16%, so grey text on it is 4.6:1.
  - **Rule:** when a colour changes for accessibility, change it everywhere it is used (tokens and SVG fills), then check every pairing.
  - The avatar's accessible name starts with its visible initials ("EG, profilo utente").


## Verification (before every push)
1. Run `npm run build` and `npm run lint`.
2. Run `npx vite preview --port 4173`, then check with Playwright at 1440×900 and 390×844. Playwright is preinstalled (`/opt/node-tools/node_modules/playwright`, Chromium at `/opt/pw-browsers`). Check:
   - The interactions you changed.
   - No horizontal overflow (`scrollWidth <= innerWidth`).
   - An axe-core audit. Install `axe-core` in the scratchpad and inject `axe.min.js`. Expect no violations, except `color-contrast` on the faded empty-state placeholders in Scenario 4 (kept by the user's choice).
3. Compare screenshots against Figma at both widths.
4. Don't `pkill -f` with a pattern that appears in the same shell command line, because it kills the shell. Stop the preview server separately.
5. Push to the feature branch only, then tell the user what changed. They merge to `main` when ready.
