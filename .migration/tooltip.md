# tooltip

2026-08-15, golden pair + custom-API preservation, success

## Changed

- `src/ui/tooltip.tsx` — `@radix-ui/react-tooltip` → `@base-ui/react/tooltip`.
  - **User's API preserved**: `Tooltip` keeps `delayDuration` prop (mapped to Base UI
    Provider's `delay`; Base UI Root has no delay prop). `TooltipPortal` kept (media-player
    uses a custom portal container for fullscreen) and gains `z-50` class.
  - Anatomy change: Radix `Portal > Content > Arrow` → Base UI `Portal > Positioner > Popup
    (+ Arrow)`; `TooltipContent` accepts `side`/`sideOffset`/`align`/`alignOffset` forwarded
    to `Positioner` (registry pattern).
  - **`container` prop added to `TooltipContent`** (forwards to internal `Portal`) — media-player
    needs the tooltip inside its fullscreen root, and nesting `TooltipPortal` around the new
    self-portaling `TooltipContent` would double-portal to body.
  - Styling: user's `bg-primary text-primary-foreground` scheme kept; animation classes
    rewritten from `data-[state=delayed-open]` to Base UI `data-open`/`data-closed`;
    `origin-(--transform-origin)` replaces `--radix-tooltip-content-transform-origin`.
  - Leftover sweep: `grep radix` → clean.
- `src/ui/media-player.tsx` (Task 10 file, patched for the build gate):
  - `MediaPlayerTooltip`: `TooltipTrigger asChild` → `render={children}` (children now typed
    `React.ReactElement` — callers always pass a single Button); dropped the outer
    `TooltipPortal` in favor of `container` on `TooltipContent`; removed the `TooltipPortal`
    import.
  - `portalContainer`/`MediaPlayerPortal.container` narrowed `Element | DocumentFragment`
    → `HTMLElement` (only ever `rootRef.current` or `document.body`).

## Left alone

- Other tooltip consumers: none outside media-player (verified).

## Behavior changes

- `delayDuration` semantics now map to Base UI Provider `delay` (same intent, different prop
  name under the hood); tooltip remains hover-delayed via context value 600ms.
- `data-[state=delayed-open]` no longer emitted — animations key off `data-open`/`data-closed`.

## Verify by hand

- Hover media-player controls: tooltip appears after ~600ms with shortcut kbd; fullscreen mode
  renders tooltips inside the player root; tooltip disappears on leave.
