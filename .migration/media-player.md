# media-player

2026-08-15, transformation engine (no golden pair — hand-rolled component), success

## Changed

- `src/ui/media-player.tsx` — all radix internals migrated to Base UI; zero `@radix-ui`
  imports remain (sweep clean).
  - **Slot → useRender** (10 sites): `const X = asChild ? Slot : "div"` →
    `useRender({ defaultTagName, render, props: mergeProps(...) })`. Sites: Root, Video,
    Audio, Controls, Loading, Error, VolumeIndicator, ControlsOverlay, Time (×2 branches).
    `asChild` prop replaced by `render` (Base UI idiom); `data-*` literals cast
    `as React.ComponentProps<"tag">` per the mergeProps pitfall. Refs moved into the
    mergeProps object (useRender's `ref` param rejects composed callback refs).
  - **HoverCard → PreviewCard** (volume popover): `Root` `openDelay`/`closeDelay` →
    `Trigger` `delay={0}`/`closeDelay={100}` (Base UI moved delays to Trigger);
    `Portal > Content` → `Portal > Positioner > Popup`; `--radix-hover-card-...` →
    `--transform-origin`; `data-[state=open]` → `data-open`.
  - **Slider** (seek + volume): `Root > Track > Range + Thumb` → Base UI anatomy
    `Root > Control > Track > Indicator + Thumb`; `Range` → `Indicator`; `onValueCommit` →
    `onValueCommitted`; handlers retyped `(value: number[])` →
    `(value: number | readonly number[])` with `Array.isArray` guard (Base UI passes a
    number for single-value sliders).
  - `data-[disabled]` → `data-disabled` (Base UI shorthand) on Root/seek slider.
- `src/features/post/components/embed-video.tsx:43` — `MediaPlayerVideo asChild` →
  `render={<HLSPlayer …/>}`.
- `MediaPlayerPlaybackSpeedProps` (from Task 8) unchanged — already Base UI.

## Left alone

- media-chrome store hooks, HLS player, seek-tooltip manual positioning, `MediaPlayerPortal`
  (raw `ReactDOM.createPortal`) — not radix, untouched.

## Behavior changes

- Volume slider value change is now `(value, eventDetails)`; `onValueCommitted` doesn't fire
  if value didn't change (Base UI semantics).
- Seek slider `onValueChange` receives `number` (single-value) instead of `number[]`; the
  `Array.isArray` guard normalizes both shapes.
- PreviewCard trigger is an `<a>`-based anchor with hover delays moved to the trigger.

## Verify by hand

- Play/pause, seek (drag + tooltip with thumbnail + chapters), volume popover (hover trigger →
  slider appears, mute button, vertical drag), loop, fullscreen, PiP, download, settings
  (speed/quality/captions submenus), keyboard shortcuts (space, arrows, m, f, p, c, numbers).
- Embedded video in feed: HLS plays, controls overlay + auto-hide work, fullscreen renders
  tooltips + menus inside the player root.
