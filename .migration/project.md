# Project: Radix UI → Base UI migration (whole-project)

2026-08-15, whole-project mode (base-nova style switch), COMPLETE

## Dependency swap

- Added: `@base-ui/react` 1.7.0 (Task 1).
- Removed (all 14 radix packages, Tasks 9 + 12): @radix-ui/react-avatar, react-dialog,
  react-dropdown-menu, react-hover-card, react-popover, react-radio-group, react-scroll-area,
  react-select, react-separator, react-slider, react-slot, react-tabs, react-toggle, react-tooltip.
- `components.json`: `"style": "new-york"` → `"base-nova"` (Task 1).
  - **FLAG (skill-mandated)**: `base-nova` is a registry style; the project's non-registry
    wrappers (media-player, custom tabs variant API) were hand-migrated, and future
    `shadcn add` will now deliver base-nova variants, matching this migration.

## Wrappers migrated (15 files, one commit each)

| Component | Strategy | Consumers repointed |
|---|---|---|
| button | merge (custom variants replayed) | post-card-menu (render), media-player internals |
| badge | golden pair verbatim | — (API-compatible) |
| separator | golden pair verbatim | — |
| avatar | golden pair verbatim | — |
| radio-group | golden pair verbatim | — |
| scroll-area | golden pair verbatim | — |
| tabs | custom API preserved (variant context) | — |
| tooltip | custom API + container passthrough | media-player (render, container) |
| hover-card | golden pair + delay move | author-hover-card (delay on Trigger, render) |
| popover | golden pair, Anchor dropped | alt-reader (render) |
| dropdown-menu | golden pair + lucide icons | post-card-menu (render), media-player (render, onClick) |
| select | golden pair + lucide icons | theme-preset-select (onValueChange wrapper) |
| dialog, toggle | **deleted** (zero consumers) | — |
| media-player | transformation engine | embed-video (render) |

## App-code sweep

All consumers migrated inline with their wrappers; final sweep confirmed zero `@radix-ui`
imports in `src/` (only the vendored attribution comment in `src/lib/compose-refs.ts`,
which imports nothing). `asChild` usages converted to Base UI `render` props; `onSelect` →
`onClick`; `onValueCommit` → `onValueCommitted`; hover delays moved Root → Trigger.

## Baseline vs final

- Baseline: `pnpm build` green; `pnpm test` 30/30; `pnpm lint` 19 errors / 6 warnings
  (pre-existing: react-hooks/refs + purity in media-player + virtualizer, set-state-in-effect
  in use-mobile, oxlint removeEventListener in media-player).
- Final: build green; tests 30/30; lint 19 errors / 5 warnings (same pre-existing set; one
  fast-refresh warning consolidated by the media-player export restructure).

## Behavior deltas (flagged, not patched)

1. Menu `onSelect` → `onClick`: verify keyboard (Enter) activation still fires item handlers.
2. CheckboxItem/RadioItem `closeOnClick` defaults to `false` in Base UI (Radix closed by
   default) — not used by this project.
3. Slider `onValueCommitted` doesn't fire if value didn't change; single-value sliders pass
   `number` instead of `number[]` (normalized via `Array.isArray` guard).
4. Visual restyle to base-nova (rounded-lg, ring-3 focus, size-8 default button, item
   indicator right-aligned in menus) — intended per user decision.
5. Tabs: Base UI activation model; `data-active` replaces `data-[state=active]`.

## Verify by hand (full smoke)

- Feed: posts render, avatars, translate menu (desktop dropdown + mobile drawer), alt-text
  popover, video player (controls, seek tooltip, volume popover, settings submenus, fullscreen).
- Profile: tabs, author hover-card, follow button.
- Settings: theme radio group, language radio group, theme-preset select.
