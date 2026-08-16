# select

2026-08-15, golden pair (base-nova registry fetch) + consumer sweep, success

## Changed

- `src/ui/select.tsx` — `@radix-ui/react-select` → `@base-ui/react/select`.
  - `Select = SelectPrimitive.Root` (registry pattern; drops the `data-slot="select"` wrapper).
  - Anatomy: `Portal > Positioner > Popup > List (+ ScrollUp/DownArrow)` replaces
    `Portal > Content > Viewport`; `ScrollUpButton` → `ScrollUpArrow`; `position="popper"`
    prop dropped (Base UI is always anchored; `alignItemWithTrigger` replaces the
    trigger-width/height CSS var dance).
  - Icons: registry `IconPlaceholder` → lucide (`ChevronDownIcon`, `ChevronUpIcon`, `CheckIcon`).
  - `data-[state=open]` → `data-open`/`data-closed`; `--radix-select-*` vars →
    `--available-height`/`--anchor-width`/`--transform-origin`.
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.
- `src/features/settings/theme-preset-select.tsx:63` (consumer) — `onValueChange` signature
  changed to `(value: string | null, eventDetails)`; handler wrapped:
  `onValueChange={(value) => onPresetChange(value ?? "")}`.

## Left alone

- No other consumers.

## Behavior changes

- `onValueChange` now receives `(value, eventDetails)`; Base UI `value` is `string | null`
  (Radix `""` for empty).
- Keyboard typeahead + arrow-key selection now Base UI semantics.

## Verify by hand

- Theme preset selector in Settings: opens, lists presets with badges, arrow keys navigate,
  Enter/click selects, check indicator shows on selected, Escape closes.
