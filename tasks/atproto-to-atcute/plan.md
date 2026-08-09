# Implementation Plan: Migrate from @atproto/api to atcute (OAuth)

> **Status: COMPLETE** — all tasks landed. Plan kept as-is below; completed checkboxes marked.
> Deviation: the OAuth callback route lives at `src/routes/oauth/callback.tsx` (directory layout) — a flat
> `oauth-callback.tsx` file generates path `/oauth-callback`, which would not match the redirect_uri.

## Overview

Replace `@atproto/api` (Agent/CredentialSession + generated types + RichText) with the atcute
ecosystem: `@atcute/client` (XRPC client), `@atcute/oauth-browser-client` (OAuth 2.0 + PKCE + DPoP
auth for SPAs — user's choice over password auth), `@atcute/bluesky` + `@atcute/atproto`
(definitions/types), and `@atcute/bluesky-richtext-segmenter` (replaces `RichText`).

Auth flow changes from identifier+password+2FA to a handle-entry → PDS authorization server
redirect → callback. This inherently requires every existing password session to re-authenticate
once via OAuth (no token migration possible).

Behavior preservation decision (user-confirmed): **one `Client` whose handler is swapped** between
`simpleFetchHandler({ service: PUBLIC_ENDPOINT })` (anonymous) and `OAuthUserAgent` (authenticated)
on auth-state change. All reads route exactly as they do today.

## Architecture Decisions

1. **OAuth browser client** (`@atcute/oauth-browser-client`) for authentication. Login UX becomes
   handle-only; PDS handles 2FA. Scope: `atproto transition:generic` (app performs no writes).
2. **Session storage moves out of zustand** — the OAuth library persists tokens internally
   (localStorage, DPoP-bound). The zustand `persist` store keeps only `{ did, handle }` (UI
   tracking), under a **new storage key** (`atcute-oauth`) — the old `atp-store` payload is ignored.
   `did` replaces `session.did` consumers; `handle` replaces `session.handle`. The persisted
   `didDoc` field was never read anywhere → dropped.
3. **Dev server host changes `localhost` → `127.0.0.1`** (AT Protocol OAuth forbids `localhost`),
   using the spec's loopback dev client_id trick (`http://localhost?redirect_uri=...&scope=...`).
   Port **5790 stays**; `tauri.conf.json` `devUrl` must be updated to `http://127.0.0.1:5790`.
   Vite env vars `VITE_OAUTH_CLIENT_ID`, `VITE_OAUTH_REDIRECT_URI`, `VITE_OAUTH_SCOPE` drive the
   config (README pattern).
4. **Type guards**: replace `AppBskyFeedDefs.isPostView()` & co. (which only check `$type` today —
   see `src/utils/validation.ts` doc comment) with a tiny `isType(value, $type)` string-check
   helper, preserving the no-validation hot-path behavior. `@atcute/lexicons/validations` `is()`
   stays available where full validation is wanted. `dangerousIsType` becomes unused → deleted.
5. **Type renames** (same lexicon, different exports): `$Typed<T>` → `T`;
   `AppBskyFeedPost.Record` → `AppBskyFeedPost.Main`;
   `AppBskyFeedGetPostThread.OutputSchema['thread']` → `AppBskyFeedGetPostThread.$output['thread']`;
   `AppBskyFeedGetAuthorFeed.QueryParams` → `AppBskyFeedGetAuthorFeed.$params`; `Facet` →
   `AppBskyRichtextFacet.Main`. Everything else (`AppBskyFeedDefs.PostView`,
   `AppBskyActorDefs.VerificationState`, `AppBskyEmbedImages.ViewImage`, ...) keeps its name.
   `PostView.record` is `unknown` in atcute — existing `as` casts stay.
6. **Richtext**: `segmentize(text, facets)` from `@atcute/bluesky-richtext-segmenter` replaces
   `new RichText(...).segments()`. Segments are `{ text, features? }`; feature `$type` switch on
   `app.bsky.richtext.facet#mention|link|tag` replaces `isMention()/isLink()/isTag()`.
   (atcute's lexicon facet `index` is already `{ byteStart, byteEnd }`, matching the segmenter —
   no adapter needed.)
7. **Remote calls**: `agent.app.bsky.feed.getFeed(...)` → `client.get('app.bsky.feed.getFeed', { params })`;
   throw-on-error via `ok()` helper (matches today's throwing behavior; react-query expects it).
   Response success checks (`res.success`) become `res.ok`. Note: `ok()` unwraps `.data` itself —
   `const data = await ok(...)`, not `const { data } = await ok(...)`.
8. **Bundle**: drop the `@atproto/api` manual chunk entirely (no `manualChunks` in `vite.config.ts`).

## Task List

### Phase 1: Foundation

- [x] **Task 1: Dependencies + dev/prod OAuth plumbing (S)**
      Installed `@atcute/client`, `@atcute/bluesky`, `@atcute/atproto`, `@atcute/lexicons`,
      `@atcute/oauth-browser-client`, `@atcute/identity-resolver`,
      `@atcute/bluesky-richtext-segmenter`. Updated `vite.config.ts` (server host `127.0.0.1`,
      oauth env plugin per README, `manualChunks` dropped entirely), `tauri.conf.json`
      (`devUrl` → `http://127.0.0.1:5790`), added `public/oauth-client-metadata.json`
      (client_id placeholder for the hosted doc). Added `src/types/atcute.d.ts` with
      `/// <reference types="@atcute/bluesky" />` for XRPC method typing.
      *Verified*: `pnpm build` green; `pnpm dev` serves on `http://127.0.0.1:5790`.

- [x] **Task 2: Types layer → atcute (M)**
      Migrated `src/types/response-schema.ts`, `src/lib/atp/map.ts`, `src/lib/atp/mapping/threads.ts`,
      `src/lib/atp/types/any-profile-view.ts`, `src/lib/atp/strings/labels.ts` (+
      `labels.test.ts` → `ComAtprotoLabelDefs.Label` from `@atcute/atproto`),
      `src/lib/atp/hooks/use-verification.ts` (type import only) to atcute types. Added
      `src/lib/atp/types/is-type.ts` helper; replaced all `AppBsky*.is*` guard calls; deleted
      `dangerousIsType` from `src/utils/validation.ts` (file removed). Applied decision-5 renames.
      *Verified*: `pnpm build` green (after Task 3 cut-over), `pnpm test` green (labels tests),
      `pnpm lint` green. No `@atproto/api` import remains in these files.

### Checkpoint: Foundation
- [x] Build + tests + lint green with @atproto/api only in components/richtext/store
- [x] Spot-check thread view + feed rendering in dev (mapping logic unchanged, types swapped)

### Phase 2: Core cut-over

- [x] **Task 3: Store + data hooks cut-over (M — 9 small files, one subsystem)**
      Rewrote `src/lib/atp/store.ts`: `configureOAuth` at module load (metadata from env, identity
      resolver from `@atcute/identity-resolver` with `XrpcHandleResolver` →
      public.api.bsky.app); state = `client`, `did`, `handle`, `isAuthenticated`,
      `startAuth(identifier)`, `finalizeAuth(params)`, `restoreSession()`, `logout()`;
      zustand `persist` key `atcute-oauth` storing `{ did, handle }`; `client` recreated on
      auth change (`new Client({ handler: agent })` ↔ `simpleFetchHandler(PUBLIC_ENDPOINT)`).
      Migrated the 8 hooks (`use-feed`, `use-timeline`, `use-posts-search`, `use-actors-search`,
      `use-profile`, `use-resolve-handle`, `use-post-thread`, `use-author-feed`) from `agent.X`
      to `client.get/post` with `ok()`; `enabled: !!agent` → `!!client` (always true);
      `session?.did` → `did`, `session?.handle` → `handle`.
      *Verified*: `pnpm build` green (with Task 4 — cut-over is red until all consumers land),
      `pnpm test` green.

- [x] **Task 4: OAuth auth UX (M)**
      Rewrote `src/features/login/login.tsx` (handle-only form via react-hook-form), added route
      `src/routes/oauth/callback.tsx` (**deviated: directory layout `src/routes/oauth/callback.tsx`**,
      outside `_app` layout; parses `location.hash`, `history.replaceState` scrub,
      `finalizeAuthorization`, stores `did` + resolved `handle` via
      `com.atproto.server.getSession`, navigates `/`; StrictMode double-invoke guarded with a
      `useRef` one-shot), updated `src/lib/atp/hooks/use-auth.ts` (`startAuth` mutation; `logout`
      unchanged shape), `src/components/nav-links.tsx` (`session?.handle` → `handle`),
      `src/lib/atp/hooks/use-current-profile.ts` (`session?.handle` → `handle`). Synced `auth.*`
      i18n keys in **both** `en.json`/`es.json` (dropped `password*`, `twoFactor*`; kept
      `signInTitle`/`usernameLabel`/`usernameRequired`; `catalog.test.ts` stays green).
      *Verified*: `pnpm build` + `pnpm test` + `pnpm lint` green; manual OAuth login round-trip in
      dev: handle → PDS authorize page → callback → home shows avatar/handle; logout returns to
      anonymous and persists across reload.

### Checkpoint: Core Flow
- [x] End-to-end OAuth login works in dev (127.0.0.1:5790)
- [x] Logged-in + anonymous reads behave identically to pre-migration
- [x] Review with human before proceeding

### Phase 3: Rendering layer

- [x] **Task 5: RichText → segmentize (S)**
      Rewrote `convertRichTextToPlainText` in `src/lib/atp/utils.ts` with `segmentize` (link
      features → `feature.uri`, else segment text; shared `segmentizeFacets` export) and
      `src/components/rich-text-renderer.tsx` (`RichtextSegment[]`, feature `$type` switch,
      tag-limiting logic preserved). Added colocated unit test `utils.test.ts` covering ASCII +
      emoji/unicode facet offsets (segmentize handles UTF-8 byte indices).
      *Verified*: `pnpm build`, `pnpm test` (7 new tests pass), manual check: mention/link/tag
      rendering + copy-post-text in UI.

- [x] **Task 6: Component type imports (M)**
      Migrated `src/features/post/components/post-card.tsx` (reason guards → `isType`),
      `embed-external.tsx`, `embed-images.tsx`, `embed-video.tsx`, `src/features/search/search.tsx`,
      `src/features/profile/components/author-link.tsx`, `verified-badge.tsx` from `@atproto/api`
      to `@atcute/bluesky` type imports (names unchanged).
      *Verified*: `pnpm build` green; grep shows zero remaining `@atproto` imports in `src/`.

### Checkpoint: Rendering
- [x] Feed/post/thread/profile/search render correctly (embeds: images, video, external, quotes)
- [x] No `@atproto` imports remain anywhere

### Phase 4: Cleanup

- [x] **Task 7: Remove @atproto/api + docs (S)**
      `pnpm remove @atproto/api`; deleted now-dead `AUTHENTICATED_ENDPOINT` from
      `src/lib/atp/constants/endpoints.ts`; updated `AGENTS.md` (auth section: OAuth + atcute,
      dev host note, new deps). Final `pnpm build`, `pnpm test`, `pnpm lint`; manual smoke of the
      full app.
      *Verified*: clean build/test/lint; `pnpm dev` login round-trip; Tauri dev launches
      (`pnpm tauri dev` uses the updated devUrl).

### Checkpoint: Complete
- [x] All acceptance criteria met
- [x] Full manual smoke: login, feed, timeline, thread, profile, author feed filters, search
      (posts + actors), post detail, embeds, richtext, logout, reload persistence
- [x] Ready for review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AT Protocol OAuth forbids `localhost`; dev flow needs loopback host + client_id trick | High | README's exact Vite pattern; host `127.0.0.1` + updated `tauri.conf.json` `devUrl` (Task 1) |
| Production web deploy needs a hosted OAuth client metadata doc + https callback route | High | `public/oauth-client-metadata.json` shipped; config env-driven (`VITE_OAUTH_CLIENT_ID`); deployment task documented as follow-up (needs domain) |
| Packaged Tauri app can't rely on http:// redirects for OAuth callback | Med | Out of scope for this migration; note for follow-up (custom scheme / tauri-plugin-oauth / hosted backend). Dev-mode Tauri works via 127.0.0.1 |
| Structural type friction between atcute types and old component boundaries | Med | Task 2 keeps build green; Task 6 fixes consumer frictions with casts; tsc is the oracle |
| Sessions without refresh tokens expire silently | Low | `getSession(did, { allowStale: true })` + failure → clear store → anonymous; re-login UX already exists |
| `is()` validation cost in hot feed-reduction loops | Low | `isType` $type-string helper used in hot paths (decision 4) |
| React Compiler + `useMemo` in rich-text-renderer (unchanged pattern, new segment type) | Low | Keep existing memo structure; compiler violations fail build — caught by Task 5 verify |

## Open Questions

- Production URL/domain for the OAuth client metadata doc and callback (deployment follow-up —
  not blocking code migration; dev flow fully works without it)
- Production OAuth strategy for the Tauri desktop build (needs its own decision later)
