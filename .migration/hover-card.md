# hover-card

2026-08-15, golden pair (base-nova registry fetch) + consumer sweep, success

## Changed

- `src/ui/hover-card.tsx` — `@radix-ui/react-hover-card` → `@base-ui/react/preview-card`
  (Base UI renamed the primitive; wrapper keeps the `HoverCard*` export names).
  - Anatomy: Radix `Portal > Content` → Base UI `Portal > Positioner > Popup`; `side`/`sideOffset`/
    `align`/`alignOffset` forwarded to `Positioner` (registry pattern).
  - Animation classes: `data-[state=open]` → `data-open`/`data-closed`; `--radix-hover-card-...`
    → `--transform-origin`.
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.
- `src/features/profile/components/author-hover-card.tsx` (consumer):
  - `openDelay`/`closeDelay` moved from `HoverCard` Root to `HoverCardTrigger` — Base UI
    renamed them `delay` (open) + `closeDelay` on the Trigger part.
  - `asChild` → `render={children}`; `children` retyped from `PropsWithChildren` to
    `React.ReactElement` (callers pass a single element; verified both call sites:
    parse-bio.tsx:25, author-link.tsx:32).

## Left alone

- No other consumers.

## Behavior changes

- Delay props live on the Trigger now (Base UI API); semantics identical.

## Verify by hand

- Hover an author link in a post: card appears after 400ms, closes 200ms after leave; card
  contents (profile display + follow button) render; data lazy-loads on hover.
