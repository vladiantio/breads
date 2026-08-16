# popover

2026-08-15, golden pair (base-nova registry fetch) + consumer sweep, success

## Changed

- `src/ui/popover.tsx` — `@radix-ui/react-popover` → `@base-ui/react/popover`.
  - Anatomy: Radix `Portal > Content` → Base UI `Portal > Positioner > Popup`.
  - `PopoverAnchor` **dropped** — Base UI has no Anchor equivalent (skill: inert passthrough +
    flag). Verified zero consumers.
  - Animation classes: `data-[state=open]` → `data-open`/`data-closed`; `--radix-popover-...`
    → `--transform-origin`.
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.
- `src/features/post/components/alt-reader.tsx:48` (consumer) — `PopoverTrigger asChild` →
  `render={<AltReaderButton />}`.

## Left alone

- `PopoverHeader`/`PopoverTitle`/`PopoverDescription` not added (not present in user's file,
  no consumers).

## Behavior changes

- None beyond attribute naming (`data-open`/`data-closed`).

## Verify by hand

- Alt-text "Read" button on images: popover opens on click, closes on outside press/Escape;
  mobile path (drawer) unchanged.
