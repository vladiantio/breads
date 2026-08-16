# tabs

2026-08-15, golden pair + custom-API preservation, success

## Changed

- `src/ui/tabs.tsx` — `@radix-ui/react-tabs` → `@base-ui/react/tabs`.
  - **User's custom API preserved**: `variant` ("default" | "underline") is passed on `Tabs`
    and threaded to `TabsTrigger` via the existing `TabsContext` (consumers use
    `<Tabs variant="underline">` — feed-tabs.tsx:61, profile-tabs.tsx:225). Base UI's
    registry variant-on-TabsList API was NOT adopted to avoid touching consumers.
  - Part renames: `Trigger` → `Tab`, `Content` → `Panel` (Base UI naming).
  - State attribute: `data-[state=active]` → `data-active` (Base UI shorthand) in
    `tabsTriggerVariants`.
  - Base classes kept from the user's file (rounded-sm px-3 py-2, focus ring-3); registry's
    base-nova trigger classes not adopted — user's look survives (their variant system is
    custom, not the registry's `line` variant).
  - Import path: `@/lib/utils` (unchanged).
  - Leftover sweep: `grep radix` → clean.

## Left alone

- `src/features/feed/components/feed-tabs.tsx`, `src/features/profile/components/profile-tabs.tsx`
  — consumers use `variant="underline"`, unchanged API → no edits.

## Behavior changes

- Base UI tabs use pointer+keyboard activation model; `data-active` replaces
  `data-[state=active]`. Tab activation behavior (click vs focus) matches Base UI defaults —
  flagged, not patched.

## Verify by hand

- Feed + profile tab strips: click switches tabs, underline variant shows active underline,
  arrow keys navigate tabs, focus ring visible.
