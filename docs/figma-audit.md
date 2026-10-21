# Figma audit — handoff for a Figma-fixing session

Read this first. It is self-contained: a fresh session should be able to fix the Figma file from it.

## Goal
Fix the typos and inconsistencies an audit found in the UNOX DDC Oven page design (21 Oct 2026), so Figma and the built prototype say the same thing. Work in Figma only. Code changes are a separate step (see "After Figma").

## Where
- Figma file key `FH7w3DPC1SqueKQXfsQzHk`, page "🖋️ Exercise" (`31703:201`).
- Frames (desktop / mobile / alert sheets):
  - Scenario Base: `37704:2240` / `37704:2841` / `37704:2759`, `37704:2798`
  - Activity in Progress - Idle: `37704:5820` / `37704:6380` / `37704:6341`, `37704:6800`
  - Manutenzione Richiesta: `37704:8907` / `37704:9537` / `37704:9439`, `37704:9487`, `37704:9968`
  - Forno Appena Registrato: `37704:10647` / `37704:11180`
  - Component "Oven-Overview-Card": `37704:4165` (Desktop/Mobile × Closed/Open)
- Node ids below are from the audit. Instance-child ids look like `I37704:4166;37704:3912`. If an id no longer resolves, find the layer by its text in the same card.

## How to work
1. Load the `figma-use` skill before every `use_figma` call (mandatory). Use `get_design_context` / `get_screenshot` to read. For reads, load `figma-design-to-code` first.
2. **Fix directly:** clear typos, double or trailing spaces, casing, and a layer that disagrees with its own siblings in the same card. Change text and styles only, never layout.
3. **Ask the user first** about anything marked **❓ decision**. The user is the designer: give the options and a recommendation, then wait.
4. After each group of edits, screenshot the frame and show the user before and after.
5. Prefer editing the **component** (main) over instances when the issue is in a component, e.g. the Oven-Overview-Card variants.
6. Copy is Italian. Alert titles are sentence case.

## Already decided — do not change or report
- Alert titles: "Camera sporca", "Camera molto sporca", "Manutenzione richiesta", "Detergenti quasi esauriti" (CTA "Ordina detergenti").
- **Nav labels stay in English** ("Ovens", "Dashboard", "Analytics", …), as decided earlier in the project.
- The code uses accessible colours on purpose, so Figma may differ: accent `#006fd9`, alarm `#e6002e`, green-500 `#008a00`, grey-300 `#707070`, yellow-500 `#ad8205`, online dot `#469d2a`, background-tertiary `#ebebeb`, alarm-16 at 10%. Updating Figma to these is a ❓ decision, not a typo.
- The faded placeholder text in Forno Appena Registrato is intentional.

## Findings checklist

### A. Typos and copy (fix directly)
- [ ] **A1** Forno Appena Registrato, desktop, Ore di utilizzo: `-  min` has a double space in all 5 rows (`37704:11038`, `11049`, `11060`, `11071`, `11082`). Mobile shows `- h`. The code and the agreed copy use `- h` / `- min · 0%`. Fix desktop to `- min` (single space) and check that mobile matches what the desktop row says.
- [ ] **A2** All scenarios, Ore di utilizzo: values have a trailing space (`11 h 30 min `, `6 h `, `5 h `, `2 h `). Desktop `37704:2637`, `2648`, `2659`, `2670`; mobile `3138`, `3149`, `3160`, `3171`, and the same rows in the other scenarios. Trim them.
- [ ] **A3** Forno Appena Registrato, Ricette: `Crea un Gruppo` → `Crea un gruppo` (`37704:11114`), sentence case like the other buttons.
- [ ] **A4** Idle, Attività in corso hint: `Consigliato lavaggio prima della prossima cottura.` contradicts the critical alert ("Necessario lavaggio…"). → `Necessario lavaggio prima della prossima cottura.` (`I37704:6008;35720:2876;37704:6861` and the mobile twin).

### B. Inconsistencies (fix directly unless marked)
- [ ] **B1** Oven-Overview-Card, **Mobile Closed** variant shows `Nascondi informazioni` (`37704:4114`). It should be `Mostra informazioni` with the down chevron, as on Desktop Closed. This propagates to every mobile frame.
- [ ] **B2** Manutenzione, Avvisi banner (desktop `37704:9096`, mobile `37704:9633`): `Il livello dei detergenti è basso. (CD04)` is the only banner that shows a code. → `Il livello dei detergenti è basso.` (codes belong in the sheet).
- [ ] **B3** Manutenzione, desktop sheet `37704:9439` is stale:
  - It still says `Consumabili detergenti` / `Ordina consumabili` (`9462`, `9467`).
  - It has no `(MN02)`/`(CD04)` and no button icons.
  - `37704:9487` is the correct version.
  ❓ decision: update 9439 to match 9487, or delete it.
- [ ] **B4** SENSE.Klean hour axis, desktop: `2:00`, `5:00`, `8:00` (`37704:2560`, `2564`, `2568`), while the other labels are two-digit (`00:00`, `14:00`). → `02:00`, `05:00`, `08:00`. ❓ Confirm the format, because the code needs the same change.
- [ ] **B5** Scenario Base, Attività in corso: the target temperature `(190 °C)` is black on desktop (`I37704:2426;35720:2824`) and grey `#656a6e` on mobile (`I37704:2936;35807:8054`). ❓ decision: pick one. The code currently uses black on both.
- [ ] **B6** ❓ decision, low priority:
  - The overview tag says `Cottura in corso` but the Attività card tag says `Cottura`. Intended (short in context)?
  - The dirt level `Molto Sporco` is Title Case while alerts use sentence case (`Camera molto sporca`). Change it to `Molto sporco` / `Sporco` / `Pulito` everywhere? That touches SENSE.Klean, the legend and the Attività card, and needs the same change in code.

### C. Possible data errors (❓ all need the user)
- [ ] **C1** Scenario Base timeline: `1 h 16 min rimanenti`, ending `13:42`, means it is 12:26 now (code `startsAt` 12:26). But SENSE.Klean's latest reading says `Oggi alle 13:00` (`37704:2508`), which is in the future. Fix: the latest reading → `Oggi alle 12:00`, or shift the cooking times.
- [ ] **C2** Scenario Base: the Andamento attività cooking bars add up to about 45 h over 7 days, but Ore di utilizzo totali says `42 h 30 min` (`37704:2618`). Align one of them.
- [ ] **C3** Forno Appena Registrato, Filtro RO.Care: a just-registered oven shows `Data installazione 12/03/2026` and `Ultimo aggiornamento 10/10/2026 12:05` (`37704:11018`, `11023`), copied from Base. Suggest a recent installation date (e.g. today) and `Ultimo aggiornamento` = registration time.
- [ ] **C4** Forno Appena Registrato, SENSE.Klean: `0% · Pulito` (`37704:10917`) sits right above `Nessun dato ancora disponibile`. Show `- %` or no value?
- [ ] **C5** (layer names only) SENSE.Klean bar layers have stale names (e.g. `13:00 · 62%` on the 78% and 0% bars). Rename them or leave them.

### D. Style and tokens (fix directly; they are layers out of line with their siblings)
- [ ] **D1** `Filtro acqua` subtitle uses Inter Regular 13/18 `#6b7280` in Idle, Manutenzione and Forno Appena Registrato (`37704:6164`, `6622`, `9790`, `10994`). Base uses Roboto 14/16 (`37704:2582`). Set paragraph/small + content-quaternary.
- [ ] **D2** Area download: `PDF · 1,1 MB`, `ZIP · 38 MB`, `PDF · 0,4 MB` (`37704:2725`, `2736`, `2744`) use `#6b7280`. → content-quaternary `#656a6e`, like their siblings. Check all scenarios.
- [ ] **D3** Activity Card corner radius is a hard-coded 12px in Manutenzione (`37704:9106`) and Forno Appena Registrato (`37704:10834`). → radius-fixed-16.
- [ ] **D4** Card titles: `Filtro RO.Care` (`37704:2580`) is Montserrat SemiBold with normal line height. → heading/xsmall. ❓ For the SENSE.Klean title (`37704:2502`), `– Livello di sporco` is in Montserrat Regular. Is that an intentional two-weight title? The code renders it as one weight.
- [ ] **D5** Idle, overview tag label `Camera molto sporca` is content-primary (`I37704:7313;37704:3912;37704:886`); the other tags use content-secondary. → content-secondary.
- [ ] **D6** `185 °C` uses a raw `#b30024` instead of a token. Bind it to the matching red variable (red-500 or similar), if one exists.
- [ ] **D7** Naming hygiene (no visual change):
  - The `lable/*` variable collection → `label/*` (it renames the variables; ❓ ask, it may affect other files).
  - Layer `Livello sporco cameta` → `camera`.
  - The Avvisi cards are named `Card · SENSE.Klean` → `Card · Avvisi`.
  - Mobile sheet `37704:9968` is named `…Warning-Very-Dirty` → `…Critic`.
- Note: the overview tags (M, 12/6 padding, full round) differ from the card tags (S, 8/4, 16 radius) by design. That's not an issue.

## Checked and fine (no action)
- Spelling and accents: è, à, ù and ’ are correct, and all parentheses are closed.
- Alert counts:
  - Bell counts (2, 2, 3) = the number of alerts minus the one named in the tag.
  - `+2 altri avvisi` matches every sheet.
- Percentage ↔ label: 62% Sporco, 78% Molto Sporco, 0% Pulito.
- Number formats: `3.482 h`, `4,2 MB`.
- Usage breakdown: it sums to 42 h 30 min, the percentages total 100, and the bar widths match.
- Recipe counts: 24 / 8 / 5.
- Activity: 68% ↔ 1 h 16 min ↔ 13:42.
- Breadcrumb ↔ oven name.
- Shared cards: Ricette, Area download and Andamento are identical across scenarios.

## After Figma: code follow-up (separate code session)
These findings also live in the code (`src/`) and need the same change once the user confirms the Figma decision. Open a code session, point it at `docs/session-context.md` and this list, and use the single working branch `claude/prototype-updates` with a PR (the user merges):
- A3 `Crea un gruppo`: `src/components/oven/RecipesCard.tsx`
- A4 Idle hint: `src/data/scenarios/idle.ts` (`hint`)
- B4 hour labels: `src/data/scenarios/cooking.ts` (`hourly[].hour`), if two-digit is chosen
- B5 target temperature colour: `src/components/oven/ActivityCard.tsx`, if grey is chosen
- B6 dirt labels casing: `src/components/oven/senseKlean.ts`, if sentence case is chosen
- C1 `readAt`: `src/data/scenarios/cooking.ts`, `idle.ts`, `maintenance.ts` (`'Oggi alle 13:00'`, and the 13:00 bar)
- C2, C3, C4: `src/data/scenarios/cooking.ts` / `newOven.ts`, depending on what the user decides
- Search placeholder `Search` (`src/components/layout/TopBar.tsx`): ❓ ask whether it follows the English-nav decision or becomes `Cerca`.
