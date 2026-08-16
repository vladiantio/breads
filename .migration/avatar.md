# avatar

2026-08-15, golden pair (base-nova registry fetch), success

## Changed

- `src/ui/avatar.tsx` — `@radix-ui/react-avatar` → `@base-ui/react/avatar`.
  - Wrapper gained the registry's `size` prop (`default | sm | lg`, `data-size` attribute);
    consumers pass their own size classes, so this is additive.
  - Root lost `overflow-hidden` in favor of the base-nova `after:` inset border ring
    (`mix-blend-darken`/`mix-blend-lighten`) — intended base-nova look.
  - `AvatarImage`/`AvatarFallback` re-typed to `AvatarPrimitive.Image.Props`/`.Fallback.Props`.
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.

## Left alone

- `src/components/user-avatar.tsx` — consumer; passes `size-8/10/12/16/20` via className
  (tailwind-merge overrides the `size-8` default), `border`, `onClick`, `role` — all fine.

## Behavior changes

- Avatar root renders an inset border ring via `after:` pseudo-element instead of
  `overflow-hidden` clipping.

## Verify by hand

- Avatars in post cards, thread headers, and profile headers render; fallback initials show
  while images load; hover ring looks right in light + dark themes.
