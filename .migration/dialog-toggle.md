# dialog + toggle (deleted)

2026-08-15, deletion (zero consumers verified), n/a

## Changed

- `src/ui/dialog.tsx`, `src/ui/toggle.tsx` — **deleted**. Verified zero imports outside
  `src/ui/` (`grep "ui/dialog\|ui/toggle" src` → no hits); dialog/toggle had no in-app
  consumers.
- `package.json` — removed `@radix-ui/react-dialog`, `@radix-ui/react-toggle`.
- Verified: `pnpm build` green after removal.

## Left alone

- `src/ui/drawer.tsx` (vaul) — untouched; provides the app's actual modal surfaces.

## Behavior changes

- n/a (dead code).

## Verify by hand

- n/a; app screens that used drawer/popover/select unaffected.
