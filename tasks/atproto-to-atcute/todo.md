# Migration: @atproto/api → atcute (OAuth)

**Status: COMPLETE** — all tasks landed and verified. Deviation from the original plan:
the OAuth callback route is `src/routes/oauth/callback.tsx` (directory layout) — a flat
`oauth-callback.tsx` file generates `/oauth-callback`, which doesn't match the redirect_uri.

## Phase 1: Foundation

- [x] **Task 1: Dependencies + dev/prod OAuth plumbing** (S)
      Installed `@atcute/client`, `@atcute/bluesky`, `@atcute/atproto`, `@atcute/lexicons`,
      `@atcute/oauth-browser-client`, `@atcute/identity-resolver`,
      `@atcute/bluesky-richtext-segmenter`.
      - `vite.config.ts`: server host `127.0.0.1`, oauth env plugin (README pattern),
        drop `manualChunks` entirely
      - `src-tauri/tauri.conf.json`: `devUrl` → `http://127.0.0.1:5790`
      - `public/oauth-client-metadata.json` (new)
      - `src/types/atcute.d.ts` (new): `/// <reference types="@atcute/bluesky" />`
      - Verified: `pnpm build` green; `pnpm dev` on `http://127.0.0.1:5790`

- [x] **Task 2: Types layer → atcute** (M)
      Files: `src/types/response-schema.ts`, `src/lib/atp/map.ts`,
      `src/lib/atp/mapping/threads.ts`, `src/lib/atp/types/any-profile-view.ts`,
      `src/lib/atp/strings/labels.ts`, `src/lib/atp/strings/labels.test.ts`,
      `src/lib/atp/hooks/use-verification.ts`
      - Added `src/lib/atp/types/is-type.ts` helper; replaced `AppBsky*.is*` guards
      - Renames: `$Typed<T>`→`T`, `AppBskyFeedPost.Record`→`Main`,
        `OutputSchema['thread']`→`$output['thread']`, `QueryParams`→`$params`,
        `Facet`→`AppBskyRichtextFacet.Main`
      - Deleted `dangerousIsType`/`src/utils/validation.ts` (last user: threads.ts)
      - Verified: `pnpm build` + `pnpm test` + `pnpm lint` green; no `@atproto/api` in these files

## Checkpoint: Foundation
- [x] Build/tests/lint green; feed + thread render correctly in dev

## Phase 2: Core cut-over

- [x] **Task 3: Store + data hooks cut-over** (M)
      Files: `src/lib/atp/store.ts` + all 8 hooks (`use-feed`, `use-timeline`,
      `use-posts-search`, `use-actors-search`, `use-profile`, `use-resolve-handle`,
      `use-post-thread`, `use-author-feed`)
      - Store: `configureOAuth` at module load; state `client`, `did`, `handle`,
        `isAuthenticated`, `startAuth`, `finalizeAuth`, `restoreSession`, `logout`;
        persist key `atcute-oauth` with `{ did, handle }`; client handler swapped on auth change
      - Hooks: `client.get('nsid', { params })` + `ok()`; `enabled: !!client`;
        `session?.did`/`session?.handle` → `did`/`handle`
      - Verified: `pnpm build` + `pnpm test` green (with Task 4 — cut-over)

- [x] **Task 4: OAuth auth UX** (M)
      Files: `src/features/login/login.tsx` (handle-only form),
      `src/routes/oauth/callback.tsx` (new, outside `_app` — actual location
      `src/routes/oauth/callback.tsx`), `src/lib/atp/hooks/use-auth.ts`,
      `src/components/nav-links.tsx`, `src/lib/atp/hooks/use-current-profile.ts`,
      `src/i18n/locales/en.json`, `src/i18n/locales/es.json`
      - Callback: parse `location.hash`, scrub URL, `finalizeAuthorization`, store `did` +
        handle (via `com.atproto.server.getSession`), navigate `/`; StrictMode guard
      - i18n: drop `auth.password*`/`auth.twoFactor*` keys from both catalogs
      - Verified: `pnpm build` + `pnpm test` + `pnpm lint` green; manual OAuth login round-trip

## Checkpoint: Core Flow
- [x] OAuth login works end-to-end in dev; anonymous + logged-in reads behave as before
- [x] Review with human before proceeding

## Phase 3: Rendering layer

- [x] **Task 5: RichText → segmentize** (S)
      Files: `src/lib/atp/utils.ts`, `src/components/rich-text-renderer.tsx`,
      `src/lib/atp/utils.test.ts` (new)
      - `segmentize(text, facets)`; feature `$type` switch for mention/link/tag
      - Test: ASCII + emoji facet offsets for `convertRichTextToPlainText`
      - Verified: `pnpm build` + `pnpm test` green; mention/link/tag render + copy-text works

- [x] **Task 6: Component type imports** (M)
      Files: `src/features/post/components/post-card.tsx`, `embed-external.tsx`,
      `embed-images.tsx`, `embed-video.tsx`, `src/features/search/search.tsx`,
      `src/features/profile/components/author-link.tsx`, `verified-badge.tsx`
      - Swap `@atproto/api` → `@atcute/bluesky` type imports; `isType` for reason guards
      - Verified: `pnpm build` green; zero `@atproto` imports in `src/`

## Checkpoint: Rendering
- [x] Embeds (images/video/external/quote) + search + profiles render correctly

## Phase 4: Cleanup

- [x] **Task 7: Remove @atproto/api + docs** (S)
      - `pnpm remove @atproto/api`; deleted `AUTHENTICATED_ENDPOINT` (unused after cut-over);
        updated `AGENTS.md` (OAuth + atcute auth section, dev host note, new deps)
      - Final: `pnpm build`, `pnpm test`, `pnpm lint`, manual smoke, `pnpm tauri dev` launches

## Checkpoint: Complete
- [x] All acceptance criteria met; full manual smoke passes; ready for review
