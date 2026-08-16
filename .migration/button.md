# button

2026-08-15, three-way merge (user file vs new-york golden vs base-nova golden), success

## Changed

- `src/ui/button.tsx` — full rewrite onto `@base-ui/react/button` (`ButtonPrimitive`).
  - Golden-pair merge: ancestor = stock `new-york` button, ours = stock `base-nova` button,
    current = user file. Hand-resolved: base-nova classes win (style switch), the user's
    `ghost-destructive` variant (consumed by `post-card-menu.tsx:123`) was replayed onto the
    base-nova set; sizes from base-nova (`default`/`xs`/`sm`/`lg`/`icon`/`icon-xs`/`icon-sm`/
    `icon-lg`) replace the user's `h-9`-based sizes — `icon-sm`/`icon-lg` still exist so no
    consumer breaks.
  - `Slot`/`asChild` dropped; the wrapper now spreads `ButtonPrimitive.Props`, so consumers
    use the Base UI `render` prop instead of `asChild`.
  - Import fixed: registry's `@/registry/base-nova/lib/utils` → `@/lib/utils`.
  - Leftover sweep: `grep radix-ui` on button.tsx → clean.
- `src/features/post/components/post-card-menu.tsx:84,96` — two `Button asChild` → `render={<a …/>}`
  (Button-specific consumer sweep; the file's remaining `asChild` usages belong to drawer/
  dropdown-menu and are swept in their own tasks).
- `src/ui/media-player.tsx` — Button-consumer fixes (it is a Task 10 file, but the per-batch
  build gate required it to compile):
  - Dropped the now-absent `asChild` destructure in `MediaPlayerPlay`, `MediaPlayerSeekBackward`,
    `MediaPlayerSeekForward`, `MediaPlayerSettings` (`asChild: _` at old 1250/1314/1374/2791).
  - Retyped 8 `onClick` handlers from `React.MouseEvent<HTMLButtonElement>` to
    `BaseUIEvent<React.MouseEvent<HTMLButtonElement>>` (new `import type { BaseUIEvent }`).
  - `MediaPlayerPlaybackSpeedProps` no longer extends `React.ComponentProps<typeof DropdownMenuTrigger>`
    (radix trigger props conflict with Base `ButtonProps` — TS2320); the trigger props only fed a
    discarded `asChild`, so the extension was dropped. Restored properly during Task 8 (dropdown-menu).
  - `MediaPlayerVolume`'s own `asChild` and `SliderPrimitive` usage untouched (Task 10).

## Left alone

- `src/ui/carousel.tsx` — embla, not radix; its `Button asChild` usage is swept in Task 11.

## Behavior changes

- Button is now the real Base UI button primitive: `active:not-aria-[haspopup]:translate-y-px`
  press feedback, `aria-expanded` states on hover styles, Base UI focus/disabled semantics.
- Visual restyle to base-nova (rounded-lg, size-8 default, ring-3 focus) — intended.
- `onClick` event objects now carry `preventBaseUIHandler()` (Base UI event decoration) — consumers
  reading `.defaultPrevented` are unaffected.

## Verify by hand

- Buttons press/activate normally; focus ring visible on keyboard nav; disabled buttons inert.
- Translate links in post menu (desktop + mobile) open in a new tab.
- Media player play/pause, seek, volume, loop, fullscreen, PiP, download, settings buttons all work.
