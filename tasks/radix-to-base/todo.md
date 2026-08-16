# Migration: Radix UI → Base UI (`base-nova`)

**Status: NOT STARTED**

Decisions locked: whole-project mode · style `new-york` → `base-nova` (user-confirmed, visual
restyle expected) · delete dead `dialog`/`toggle` (zero consumers, verified) · migrate
`media-player.tsx` internals (raw hover-card/slider/slot) · branch `migrate/base-ui` + one commit
per component · reports in `.migration/` + this tracker.

## Phase 0: Preflight

- [ ] **Task 1: Baseline + branch + config flip** (S)
      Baseline `pnpm build && pnpm lint && pnpm test` (record pre-existing failures); branch
      `migrate/base-ui`; `components.json` → `base-nova`; install `@base-ui/react`
      (radix stays for now). Commit: `chore(base-ui): switch to base-nova style, add @base-ui/react`

## Phase 1: Wrappers, bottom-up (one commit each)

- [ ] **Task 2: button** (M) — Slot → real Base Button; replay custom variants
      (`ghost-destructive`, `icon-sm`/`icon-lg`) via three-way merge; 14 consumers → first
- [ ] **Task 3: badge** (S) — Slot → render
- [ ] **Task 4: separator + avatar** (S)
- [ ] **Task 5: radio-group + scroll-area** (S)
- [ ] **Task 6: tabs + tooltip** (M) — Tooltip Portal dropped (Base UI portals by default)
- [ ] **Task 7: hover-card + popover** (M) — hover-card → PreviewCard
- [ ] **Task 8: dropdown-menu + select** (M) — dropdown-menu → Menu
- [ ] **Task 9: delete dialog + toggle** (S) — rm wrappers; `pnpm remove @radix-ui/react-dialog
      @radix-ui/react-toggle`. Commit: `refactor(ui): remove unused dialog and toggle wrappers`
- [ ] **Task 10: media-player** (XL) — LAST (imports badge/button/dropdown-menu/tooltip).
      Engine on internals: `Slot` → `useRender`, HoverCardPrimitive → PreviewCard, SliderPrimitive →
      Slider (`Control`/`Indicator`/`onValueCommitted`). Behavior deltas flagged, never patched

## Phase 2: App-code sweep

- [ ] **Task 11: consumer sweep** (XL) — button ×14 (asChild → `render={<…/>}`), tabs ×2,
      scroll-area ×2, avatar ×1, badge ×1, dropdown-menu ×1, hover-card ×1, media-player ×1,
      popover ×1, radio-group ×1, select ×1, separator ×1. Typecheck each file

## Phase 3: Finalize

- [ ] **Task 12: remove radix deps + final verification** (M) — `pnpm remove` all 14 radix
      packages; full `pnpm build && pnpm lint && pnpm test` vs baseline; `.migration/project.md`;
      commit: `refactor(ui): complete base-ui migration, remove radix deps`

## Untouched (non-radix, skill hard rule)

alert, carousel (embla), debounced-input, drawer (vaul), image-zoom, input-add-ons, input-otp,
input, shining-text, skeleton, sonner, spinner, virtualizer — plus `src/lib/compose-refs.ts`
(vendored radix code, not an import).

## Checkpoints

- [ ] Baseline green recorded; branch + base-nova config committed
- [ ] All 13 wrappers on Base UI; `pnpm build` green; `.migration/*.md` reports written
- [ ] App compiles with zero radix imports outside the `compose-refs.ts` attribution comment
- [ ] Full green vs baseline; manual QA checklists passed; ready for review
