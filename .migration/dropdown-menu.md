# dropdown-menu

2026-08-15, golden pair (base-nova registry fetch) + consumer sweep, success

## Changed

- `src/ui/dropdown-menu.tsx` — `@radix-ui/react-dropdown-menu` → `@base-ui/react/menu`.
  - Part renames: `Item` → `Menu.Item`, `CheckboxItem` → `Menu.CheckboxItem`,
    `RadioItem` → `Menu.RadioItem`, `Label` → `GroupLabel`, `Sub` → `SubmenuRoot`,
    `SubTrigger` → `SubmenuTrigger`, `SubContent` → composed from `DropdownMenuContent`.
  - Icons: registry `IconPlaceholder` replaced with the project's lucide (`CheckIcon`,
    `CircleIcon`, `ChevronRightIcon`) — IconPlaceholder path doesn't exist in this repo.
  - Dropped registry-only `cn-menu-target`/`cn-menu-translucent` classes (no matching CSS here).
  - `data-[state=open]` → `data-open`/`data-popup-open`; `--radix-dropdown-menu-*` CSS vars →
    `--transform-origin`/`--anchor-width`/`--available-height`.
  - Item indicator moved to `right-2` (registry position; user's was left).
  - Import path fixed (`@/registry/base-nova/lib/utils` → `@/lib/utils`).
  - Leftover sweep: `grep radix` → clean.
- `src/features/post/components/post-card-menu.tsx` (consumer):
  - `DropdownMenuTrigger asChild` → `render={<PostCardMenuButton />}`.
  - Two `DropdownMenuItem asChild` (translate links) → `render={<a …/>}`.
- `src/ui/media-player.tsx` (Task 10 file, patched for build gate):
  - `MediaPlayerPlaybackSpeedProps` redefined: no longer extends `DropdownMenu` props (Base UI
    Menu.Root and Button both inherit `className`/`render`/`style` with different State types →
    TS2320 interface conflict). Menu props it uses (`open`, `defaultOpen`, `onOpenChange`,
    `modal`, `sideOffset`) declared explicitly; `onOpenChange` typed `(open: boolean) => void`.
  - `DropdownMenuTrigger asChild` → `render={<Button …/>}` in PlaybackSpeed and Settings.
  - Item `onSelect` → `onClick` (5 call sites: speed, rendition auto/id, subtitles toggle/show).
  - `--radix-dropdown-menu-trigger-width` → `min-w-(--anchor-width)`.

## Left alone

- `DropdownMenuShortcut`, `DropdownMenuGroup` — kept (registry has them).

## Behavior changes

- **`onSelect` → `onClick` rename**: Radix `onSelect` fired on keyboard Enter/Space too; Base UI
  `onClick` fires on click. Keyboard activation in Base UI menus fires via click simulation on
  Enter — flagged: verify keyboard menu activation.
- CheckboxItem/RadioItem `closeOnClick` defaults to `false` in Base UI (Radix closed by default)
  — not used by this project; flagged per skill.
- Item indicator is right-aligned (registry) vs left (user's old file).

## Verify by hand

- Post card menu (desktop): open via ⋯, items activate on click, translate links open in new tab,
  report/copy work; keyboard: Tab to trigger, Enter opens, arrows navigate, Enter activates.
- Media player: playback speed submenu + settings menu (speed/quality/captions) open, select
  closes, tooltips on triggers still show.
