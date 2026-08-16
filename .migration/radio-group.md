# radio-group

2026-08-15, golden pair (base-nova registry fetch), success

## Changed

- `src/ui/radio-group.tsx` — `@radix-ui/react-radio-group` → Base UI `RadioGroup` +
  `Radio` primitives.
  - `RadioGroupItem` now wraps `RadioPrimitive.Root` + `RadioPrimitive.Indicator` (Base UI split
    radio-group into `radio-group` and `radio` packages); check mark becomes a `span` dot instead
    of inline SVG.
  - Data attributes: `data-[state=checked]` → `data-checked` (shorthand).
  - Class customizations: `grid gap-3` → base-nova `grid w-full gap-2`; item styling updated to
    base-nova (after: hit-area, ring-3 focus, `peer`).
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.

## Left alone

- `src/features/settings/settings.tsx:41-94` — two consumers; `value`/`onValueChange` props
  unchanged (Base UI `(value, eventDetails)` signature is assignable to single-arg handlers).

## Behavior changes

- `onValueChange` now passes `(value, eventDetails)`; existing handlers take one arg → fine.
- Checked state attribute is `data-checked` instead of `data-[state=checked]`.

## Verify by hand

- Theme + language radio groups in Settings: click switches selection, arrow keys navigate,
  selected dot renders, focus ring visible.
