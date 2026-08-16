# drawer

2026-08-16, golden pair (base-luma registry fetch) + consumer sweep, success.
Note: vaul is NOT radix — the skill's default stance is to leave vaul alone,
but the user explicitly requested this migration, and the base-luma registry
now ships a real `@base-ui/react/drawer` variant, so this was migrated as a
golden pair instead of being reported as intentionally untouched.

## Changed

- `src/ui/drawer.tsx` — `vaul` → `@base-ui/react/drawer` (registry golden pair,
  verbatim with two adaptations):
  - Import path `@/registry/base-luma/lib/utils` → `@/lib/utils`.
  - `cn-font-heading` dropped from `DrawerTitle` (registry preset utility with
    no counterpart in this project; `fontHeading` preset is `inherit`, so
    output is identical).
  - New anatomy: `Root (snapPoints/swipeDirection/modal) > Portal > [Backdrop] >
    Viewport > Popup > Content`, plus new `DrawerSwipeHandle` export and a
    `useDrawer()` context (snap-points aware). Overlay is now `Backdrop` with
    swipe-progress-driven opacity; popup uses the luma rounded-4xl/popover
    surface instead of the old top/bottom/left/right `vaul-drawer-direction`
    classes.
  - Leftover sweep: `grep radix-ui|vaul` on drawer.tsx → clean.
- `src/features/post/components/post-card-menu.tsx:76` (consumer) —
  `DrawerTrigger asChild` → `render={<PostCardMenuButton />}`.
- `src/features/post/components/alt-reader.tsx:37` (consumer) —
  `DrawerTrigger asChild` → `render={<AltReaderButton />}`.
- `package.json` — `vaul@^1.1.2` removed (last usage in the repo; `pnpm
  install` pruned it).

## Left alone

- None. Both drawer consumers migrated; no other vaul usage remains.

## Behavior changes

- Swipe-gesture internals differ (vaul CSS vars `--vaul-drawer-direction` →
  Base UI `--drawer-swipe-*`, `data-[swipe-direction=*]` attributes), but the
  public API surface used here (`Drawer open/onOpenChange`, `Trigger`,
  `Content`) maps 1:1; default direction is `down` on both.
- `DrawerContent` previously always rendered the overlay + a bottom swipe
  handle pill; the Base UI variant renders the handle only when
  `showSwipeHandle` is set (default off) and the Backdrop gets
  `min-h-dvh`/snap-point-aware opacity. No consumer relied on the pill.
- Non-modal drawers (`modal={false}`) now skip the Backdrop entirely (guarded
  render) — previously vaul always rendered the overlay.

## Verify by hand

- On a mobile viewport (`isMobileDevice()`), open the "..." menu on a post:
  drawer slides from bottom, backdrop dims and closes on tap, Escape closes,
  focus returns to the trigger.
- ALT reader button on an image: drawer shows alt text, swipe-down closes.
- Drag/swipe the drawer down partway, release: it animates back or away
  (swipe-progress transitions).
