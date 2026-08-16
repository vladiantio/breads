# Implementation Plan: Migrate `src/ui/` from Radix UI to Base UI (`base-nova`)

## Overview

Migrate all radix-backed wrappers in `src/ui/` (15 files) to `@base-ui/react`, switching the
project's shadcn style from `new-york` to **`base-nova`** (user-confirmed; `base-lyra` rejected as
too sharp/compact). `dialog.tsx` and `toggle.tsx` have zero consumers (verified by grep) →
**deleted** (user-confirmed). `media-player.tsx` (3,170 lines) uses radix directly inside it
(`@radix-ui/react-hover-card`, `@radix-ui/react-slider`, `@radix-ui/react-slot`) → its internals
are in scope. After the last wrapper, all 14 radix deps are removed.

Strategy: **whole-project mode** per the migrate-radix-to-base skill — `components.json` flips to
`base-nova` upfront, wrappers migrate in dependency order with three-way merges onto the user's
customized files (custom variants like `ghost-destructive`, `icon-sm/icon-lg` must survive),
app-code sweep last, then radix dep removal. Behavior deltas are flagged, never silently patched.

## Architecture Decisions

1. **Style switch `new-york` → `base-nova`** (user-confirmed over keeping classes): registry serves
   `base-nova` (verified 200). This restyles all primitives (rounded-lg, text-sm, ring-3 focus) —
   a deliberate visual change.
2. **Golden-pair via registry URLs** (no CLI flip needed for fetching): stock `new-york` variant is
   the merge ancestor, stock `base-nova` variant is "ours", user file is "current".
   `git merge-file user.tsx radix-golden.tsx base-golden.tsx` auto-resolves most; hand-resolve
   conflicts with the skill's reference tables. Pristine wrappers use `shadcn add --overwrite`.
3. **Dead code**: `dialog.tsx` + `toggle.tsx` deleted (zero consumers); their radix deps removed
   immediately after deletion.
4. **`media-player.tsx` has no golden pair** → transformation engine: `Slot` → `useRender`,
   `HoverCardPrimitive` → PreviewCard, `SliderPrimitive` → Slider (`Control` nesting, `Range` →
   `Indicator`, `onValueCommit` → `onValueCommitted`). Must come LAST — it imports badge, button,
   dropdown-menu, tooltip wrappers.
5. **Base UI API differences** (per skill reference files): `asChild` → `render` prop; Tooltip/DropdownMenu
   `Portal` parts dropped (Base UI portals by default); `data-[state=on]` → `data-pressed` (toggle);
   slider `onValueCommit` → `onValueCommitted`, `Range` → `Indicator`, new `Control` part.
6. **Non-radix untouched** (skill hard rule): alert, carousel (embla), debounced-input, drawer (vaul),
   image-zoom, input-add-ons, input-otp, input, shining-text, skeleton, sonner, spinner, virtualizer.
   `src/lib/compose-refs.ts` is vendored radix code (not an import) → left alone.
7. **Gate**: `pnpm build` (typecheck) per component; `pnpm lint` + `pnpm test` per batch; full build
   vs baseline at the end. One commit per component on branch `migrate/base-ui`.
8. **Reports**: `.migration/<component>.md` per component + `.migration/project.md` (skill-mandated
   format), plus this task tracking.

## Task List

### Phase 0: Preflight

- [ ] **Task 1: Baseline + branch + config flip** (S)
      - Run `pnpm build && pnpm lint && pnpm test`; record any pre-existing failures (never
        attributed to the migration)
      - `git checkout -b migrate/base-ui` (clean main; `.agents/` + `skills-lock.json` untracked,
        left unstaged)
      - Flip `components.json` `"style": "new-york"` → `"base-nova"`
      - Install `@base-ui/react` (radix deps stay for now)
      - Verified: `pnpm build` green; commit `chore(base-ui): switch to base-nova style, add @base-ui/react`

## Phase 1: Wrappers, bottom-up (one commit each)

- [ ] **Task 2: button** (M) — `src/ui/button.tsx`
      Slot → real `@base-ui/react/button` primitive. Replay custom variants (`ghost-destructive`,
      `icon-sm`/`icon-lg`, focus ring classes) via three-way merge. First because it has 14 consumers.
      Verified: `pnpm build`; `.migration/button.md`; commit

- [ ] **Task 3: badge** (S) — `src/ui/badge.tsx`
      Slot → render. Verified: `pnpm build`; `.migration/badge.md`; commit

- [ ] **Task 4: separator + avatar** (S) — `src/ui/separator.tsx`, `src/ui/avatar.tsx`
      Verified: `pnpm build`; `.migration/separator.md`, `.migration/avatar.md`; commits

- [ ] **Task 5: radio-group + scroll-area** (S) — `src/ui/radio-group.tsx`, `src/ui/scroll-area.tsx`
      Verified: `pnpm build`; `.migration/radio-group.md`, `.migration/scroll-area.md`; commits

- [ ] **Task 6: tabs + tooltip** (M) — `src/ui/tabs.tsx`, `src/ui/tooltip.tsx`
      Tooltip `Portal` part dropped (portals by default). Verified: `pnpm build`; reports; commits

- [ ] **Task 7: hover-card + popover** (M) — `src/ui/hover-card.tsx` (→ PreviewCard), `src/ui/popover.tsx`
      Verified: `pnpm build`; reports; commits

- [ ] **Task 8: dropdown-menu + select** (M) — `src/ui/dropdown-menu.tsx` (→ Menu), `src/ui/select.tsx`
      Verified: `pnpm build`; reports; commits

- [ ] **Task 9: delete dialog + toggle** (S)
      `rm src/ui/dialog.tsx src/ui/toggle.tsx`; `pnpm remove @radix-ui/react-dialog @radix-ui/react-toggle`
      Verified: `pnpm build`; commit `refactor(ui): remove unused dialog and toggle wrappers`

- [ ] **Task 10: media-player** (XL) — `src/ui/media-player.tsx` (last: depends on badge, button,
      dropdown-menu, tooltip)
      Transformation engine on internals: `Slot` → `useRender` (4 usages + `asChild`), `HoverCardPrimitive`
      (volume popover) → PreviewCard, `SliderPrimitive` (seek + volume bars) → Slider with `Control`
      nesting / `Indicator` rename / `onValueCommitted`. Seek tooltip behavior deltas flagged.
      Verified: `pnpm build`; `.migration/media-player.md`; commit

## Phase 2: App-code sweep

- [ ] **Task 11: consumer sweep** (XL)
      Repoint per consumer-props.md after each wrapper lands: button ×14 (asChild → `render={<…/>}`),
      tabs ×2, scroll-area ×2, avatar ×1, badge ×1, dropdown-menu ×1, hover-card ×1, media-player ×1,
      popover ×1, radio-group ×1, select ×1, separator ×1. Typecheck each file.
      Files: `src/features/*`, `src/components/{user-avatar,nav-links,go-back-button}.tsx` etc.
      Verified: `pnpm build` green after sweep

## Phase 3: Finalize

- [ ] **Task 12: remove radix deps + final verification** (M)
      `pnpm remove @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu
      @radix-ui/react-hover-card @radix-ui/react-popover @radix-ui/react-radio-group
      @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator
      @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toggle
      @radix-ui/react-tooltip`
      Full `pnpm build && pnpm lint && pnpm test` vs baseline; `.migration/project.md`;
      commit `refactor(ui): complete base-ui migration, remove radix deps`

## Checkpoints

- [ ] After Task 1: baseline green recorded; branch + base-nova config committed
- [ ] After Task 10: all wrappers on Base UI; `pnpm build` green; 15 reports written
- [ ] After Task 11: app compiles with zero radix imports outside `src/lib/compose-refs.ts` comment
- [ ] After Task 12: full green; manual QA checklist per report passed; ready for review
