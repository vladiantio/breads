# badge

2026-08-15, golden pair (base-nova registry fetch), success

## Changed

- `src/ui/badge.tsx` — replaced `Slot`-based wrapper with the stock base-nova variant:
  `useRender` + `mergeProps` from `@base-ui/react`. Import path fixed
  (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - User's customizations: pill shape (`rounded-full px-1.5`), `[a&]:hover` hover behaviors,
    `focus-visible` ring, `data-slot="badge"` — all subsumed by the base-nova variant
    (`rounded-4xl` pill, `[a]:hover:bg-*`, ring-3 focus, `state: { slot: "badge" }`).
  - `asChild` prop dropped — verified zero consumers use it (`grep <Badge` across src).
  - Leftover sweep: `grep radix` on badge.tsx → clean.

## Left alone

- `src/features/settings/theme-preset-select.tsx:92` — consumer, works unchanged.
- `src/ui/media-player.tsx:2924,2944,2989` — `<Badge variant="outline" className="rounded-sm">`
  consumers, work unchanged (Task 10 file).

## Behavior changes

- Badge renders via `useRender` (`span` default); `data-slot="badge"` and `data-variant` state
  attributes now emitted. Visual restyle to base-nova (slightly smaller, pill radius) — intended.

## Verify by hand

- "New" badges on theme presets in Settings render with outline styling.
- Media player settings labels (Subtitles, Quality) show badges correctly.
