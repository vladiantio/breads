# separator

2026-08-15, golden pair (base-nova registry fetch), success

## Changed

- `src/ui/separator.tsx` — `@radix-ui/react-separator` → `@base-ui/react/separator`.
  - `decorative` prop dropped (Base UI has no equivalent; user's file only passed the default
    `decorative = true`, no consumer sets it).
  - Data attributes renamed: `data-[orientation=horizontal]` → `data-horizontal` /
    `data-vertical` (Base UI shorthand); classes updated accordingly.
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.

## Left alone

- `src/features/post/components/post-card-menu.tsx:128` — `<Separator />` consumer, unchanged.

## Behavior changes

- None beyond attribute naming.

## Verify by hand

- Divider between post-menu items renders; post menu layout unchanged.
