# scroll-area

2026-08-15, golden pair (base-nova registry fetch), success

## Changed

- `src/ui/scroll-area.tsx` — `@radix-ui/react-scroll-area` → `@base-ui/react/scroll-area`.
  - Part renames: `ScrollAreaScrollbar` → `Scrollbar`, `ScrollAreaThumb` → `Thumb`.
  - Orientation styling via Base UI shorthand `data-horizontal`/`data-vertical` instead of
    `orientation === "vertical" && ...` ternaries; `data-orientation` attr kept for CSS hooks.
  - Viewport focus classes updated to base-nova (`ring-[3px] ring-ring/50`, `outline-1` vs
    user's custom `ring-4 ring-ring/10 ...`).
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.

## Left alone

- `src/features/feed/components/feed-tabs.tsx`, `src/features/profile/components/profile-tabs.tsx`
  — `<ScrollArea>` consumers, unchanged.

## Behavior changes

- Scrollbar visibility now CSS-driven via `data-horizontal`/`data-vertical` (Radix used
  `data-[orientation]`); `type`/`scrollHideDelay` props not used by this project.

## Verify by hand

- Scrollable tabs overflow areas in feed + profile scroll with a visible thumb; click-drag works;
  focus ring on viewport keyboard focus.
