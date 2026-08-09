# Tasks: Migrate Lingui → i18next + react-i18next

## Task 1: i18next core setup

**Description:** Install `i18next` + `react-i18next` + `i18next-browser-languagedetector`, remove Lingui runtime/dev deps from `package.json`, and build the new i18n core: `src/i18n/i18n.ts` (i18next init + `dynamicActivate` with JSON bundle loading), `src/i18n/languages.ts` (detector config via `i18next-browser-languagedetector`: `order: ['querystring', 'localStorage', 'navigator']`, `lookupQuerystring: 'lang'`, `lookupLocalStorage: 'lang'` — same precedence as today), `src/i18n/i18n-provider.tsx` (thin `I18nextProvider` wrapper). Convert `en.po`/`es.po` → `en.json`/`es.json` **with semantic keys transcribed verbatim from the Key Table appendix in `tasks/plan.md`** (domains: `common`, `nav`, `auth`, `feed`, `post`, `profile`, `search`, `settings`, `labels`, `toast`; camelCase; translations carried over verbatim from the `.po` files; the 2 interpolated strings use `{{var}}`: `post.repostedBy`, `post.tags.more`). Remove Lingui from `vite.config.ts` (babel + vite plugins) and `eslint.config.js`; delete `lingui.config.ts`.

**Acceptance criteria:**
- [ ] `i18next`, `react-i18next`, `i18next-browser-languagedetector` in deps; all `@lingui/*` and `eslint-plugin-lingui` entries removed from `package.json`; lockfile regenerated
- [ ] `src/i18n/locales/en.json` + `es.json` exist; keys exactly match the Key Table appendix (84 keys; `settings.language` deferred to Task 7); all es translations verbatim from `es.po`; the 2 interpolated keys use `{{var}}`
- [ ] `i18n.ts` exports `t` (bound i18next instance `t`) for non-React call sites; `dynamicActivate` loads JSON bundle, sets `document.documentElement.lang`; i18next init has `supportedLngs: ['en','es']`, `load: 'languageOnly'`, `fallbackLng: 'en'`
- [ ] Detection precedence preserved: `?lang=` → localStorage `lang` → navigator → `en`; `es-MX` normalizes to `es`
- [ ] `vite.config.ts` and `eslint.config.js` have no Lingui references; `lingui.config.ts` deleted

**Verification:**
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` succeeds
- [ ] `pnpm dev`: app boots in English; `?lang=es` renders Spanish

**Dependencies:** None

**Files likely touched:**
- `package.json`
- `src/i18n/i18n.ts`, `src/i18n/languages.ts`, `src/i18n/i18n-provider.tsx`
- `src/i18n/locales/en.json`, `es.json` (new); `en.po`, `es.po` (removed)
- `vite.config.ts`, `eslint.config.js`, `lingui.config.ts` (deleted)

**Estimated scope:** Medium (7-9 files, mostly config)

## Task 2: Non-React `t` call sites

**Description:** Swap the Lingui macro import for the exported i18next `t` in the two pure lib modules that call `t` outside React.

**Acceptance criteria:**
- [ ] `src/lib/atp/strings/labels.ts` and `handles.ts` import `{ t }` from `@/i18n/i18n`; no `@lingui` imports remain
- [ ] String output identical (`Adult Content`, `Non-sexual Nudity`, `Graphic Media`, `Invalid Handle`)

**Verification:**
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` succeeds

**Dependencies:** Task 1

**Files likely touched:**
- `src/lib/atp/strings/labels.ts`
- `src/lib/atp/strings/handles.ts`

**Estimated scope:** XS (2 files)

## Checkpoint: After Tasks 1-2
- [ ] `pnpm build` + `pnpm lint` clean
- [ ] `rg "@lingui" src` → only Task 3/4 leftovers (none expected in lib/ or i18n/)
- [ ] App boots, Spanish via `?lang=es`

## Task 3: Vitest setup + i18n unit tests

**Description:** Introduce Vitest as the project's first test framework. Add `vitest` + `happy-dom` dev deps and a `test` block to `vite.config.ts` (`environment: 'happy-dom'` — the detector reads `URL`/`localStorage`/`navigator`), add `"test": "vitest run"` to `package.json`, and write unit tests for the i18n core, catalog integrity, and the two pure lib string modules. Tests colocate in `src/` as `*.test.ts` (strict-typechecked by `tsc -b` on build) and import from `vitest` explicitly — no globals, no @testing-library/react (component rendering out of scope).

**Acceptance criteria:**
- [ ] `vitest` + `happy-dom` in devDependencies; `"test": "vitest run"` script exists; `vite.config.ts` has a `test: { environment: 'happy-dom' }` block (with `/// <reference types="vitest/config" />`)
- [ ] `src/i18n/languages.test.ts` — detection precedence via public `detectLocale()`: `?lang=es` beats localStorage + navigator; localStorage beats navigator; navigator alone used; unsupported/absent → `en`; `es-MX` normalizes to `es`
- [ ] `src/i18n/i18n.test.ts` — `dynamicActivate('es')` makes `t('Home')` return the Spanish value, sets `document.documentElement.lang`; exported `t` translates; unknown keys fall back
- [ ] `src/i18n/locales/catalog.test.ts` — `en.json`/`es.json` have identical key sets; every es value non-empty; the 2 interpolated keys use `{{var}}` (no stray `{var}`); **static key-coverage test**: every `t("<literal>")` string literal found in `src/` (regex scan of `*.ts`/`*.tsx`, excluding tests) resolves to a key in `en.json` — guards against semantic-key typos
- [ ] `src/lib/atp/strings/{labels,handles}.test.ts` — `labelsToInfo` and `sanitizeHandle` return correct strings in en and after activating es

**Verification:**
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds (proves tests typecheck under strict mode)
- [ ] `pnpm lint` succeeds

**Dependencies:** Tasks 1, 2

**Files likely touched:**
- `package.json`, `vite.config.ts`
- `src/i18n/languages.test.ts`, `src/i18n/i18n.test.ts`, `src/i18n/locales/catalog.test.ts` (new)
- `src/lib/atp/strings/labels.test.ts`, `src/lib/atp/strings/handles.test.ts` (new)

**Estimated scope:** Medium (5-7 files)

## Task 4: `t` macro → `useTranslation` (components/, ui/, hooks/, routes/)

**Description:** Convert `t\`str\`` template literals to `t("<semantic-key>")` from `useTranslation()` in React files outside `features/`. Each string is replaced with the semantic key assigned in Task 1 (e.g. `t("nav.home")`, `t("common.cancel")`). Mechanical per-file change (1-6 call sites each).

**Acceptance criteria:**
- [ ] Files converted: `nav-links.tsx`, `navbar.tsx`, `go-back-button.tsx`, `mobile-nav.tsx`, `thread-content-renderer.tsx`, `scroll-area.tsx`, `drawer.tsx`, `carousel.tsx`, `media-player.tsx`, `dropdown-menu.tsx`, `select.tsx`, `hooks/use-image-preload.tsx`, `routes/_app.profile.$username.index.tsx`
- [ ] No `@lingui` imports remain in these files; each uses `useTranslation()` (or the hook exists at correct scope for non-hook components)
- [ ] All call sites use the semantic keys from Task 1's catalogs — no string literals as arguments to `t` (the Task 3 key-coverage test must pass)
- [ ] No stray `t\`` backticks remain anywhere (`rg 't`' src` clean)

**Verification:**
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` succeeds
- [ ] Manual: nav labels, aria-labels, tooltips render translated

**Dependencies:** Task 1

**Files likely touched:**
- `src/components/{nav-links,navbar,go-back-button,mobile-nav,thread-content-renderer}.tsx`
- `src/ui/{scroll-area,drawer,carousel,media-player,dropdown-menu,select}.tsx`
- `src/hooks/use-image-preload.tsx`
- `src/routes/_app.profile.$username.index.tsx`

**Estimated scope:** Medium (~13 files, 1-3 lines each)

## Task 5: `t` + `Trans` → `useTranslation` (features/)

**Description:** Convert `t\`str\`` and `<Trans>text</Trans>` to `t("<semantic-key>")` in all feature files, including the two interpolated cases: `t("post.repostedBy", { repostedBy })` in `post-card.tsx` and `t("post.tags.more", { moreTagsCount })` in `rich-text-renderer.tsx` (rich-text-renderer is in components/ but moved here because it shares the interpolation work). Keys come from the Key Table appendix in `tasks/plan.md`.

**Acceptance criteria:**
- [ ] Files converted: `feed-tabs.tsx`, `post-actions.tsx`, `home.tsx`, `login.tsx`, `embed-images.tsx`, `embed-toggle.tsx`, `embed-video.tsx`, `post-card-actions.tsx`, `post-card-content-translate.tsx`, `post-card-menu.tsx`, `post-card.tsx`, `post-thread-header.tsx`, `author-header.tsx`, `follow-button.tsx`, `profile-display.tsx`, `profile-tabs.tsx`, `hashtag.tsx`, `search.tsx`, `settings.tsx`, `rich-text-renderer.tsx`
- [ ] The 2 interpolated strings use the semantic keys with `values` object matching existing behavior (`{{repostedBy}}`, `{{moreTagsCount}}`)
- [ ] Zero `@lingui` imports and zero `Trans`/`t\`` syntax remain in `src/` (`rg -i lingui src` → only nothing); Task 3 key-coverage test passes

**Verification:**
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` succeeds
- [ ] Manual: repost banner shows "Reposted by X"; tags collapse shows "...and N+"; translated in es

**Dependencies:** Tasks 1, 2, 3, 4

**Files likely touched:**
- `src/features/**/*.tsx` (19 files)
- `src/components/rich-text-renderer.tsx`

**Estimated scope:** Medium (20 files, mechanical 1-3 line changes)

## Checkpoint: After Tasks 4-6
- [ ] `pnpm build` + `pnpm lint` clean
- [ ] `pnpm test` still green
- [ ] `rg -i "lingui" src` clean
- [ ] Manual: en + es both render fully; interpolated strings correct
- [ ] Manual: language switcher re-renders the whole UI in both locales

## Task 7: Language switcher in Settings

**Description:** Add a language selector to `Settings.tsx` (RadioGroup, mirroring the existing "Color mode" section) listing the `locales` map (`en: English`, `es: Español`) from `languages.ts`. Add a `changeLocale(locale)` helper in `languages.ts` (or the i18n core) that calls `i18n.changeLanguage(locale)`, writes `lang` to localStorage (same key the detector reads), sets `document.documentElement.lang`, and strips a stale `?lang=` querystring param via `history.replaceState` so the persisted choice wins on reload. The switcher reads the current language from `useTranslation()`'s `i18n.language`.

**Acceptance criteria:**
- [ ] `changeLocale()` exists: changes i18next language, persists `lang` in localStorage, sets `document.documentElement.lang`, removes `?lang=` from the URL
- [ ] `Settings.tsx` shows a "Language" section with en/es options; the active language is checked and reflects the current locale; new key `settings.language` added to both JSON catalogs (from the Key Table appendix)
- [ ] Switching languages re-renders the full UI immediately (all `useTranslation` components); non-React `t` (labels, handles) returns the new locale on next call

**Verification:**
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` succeeds
- [ ] `pnpm test` succeeds (add `changeLocale` case to `languages.test.ts`: persists to localStorage, updates language + `document.documentElement.lang`, strips URL param)
- [ ] Manual: switch to es → UI in Spanish; reload → stays Spanish; visit URL with `?lang=en` → localStorage choice still wins after a prior switch

**Dependencies:** Tasks 1-5 (settings.tsx conversion in Task 5)

**Files likely touched:**
- `src/i18n/languages.ts`
- `src/features/settings/settings.tsx`
- `src/i18n/languages.test.ts`

**Estimated scope:** Small (3 files)

## Task 8: Cleanup and docs

**Description:** Remove remaining Lingui traces: verify zero `@lingui`/lingui references in configs, docs, and tooling; delete `.po` files and `lingui.config.ts` if not already gone; update `AGENTS.md` — i18n section (catalogs are now committed JSON, no `lingui extract` — new strings added manually to both JSON files) and Commands section (add `pnpm test`, replace the "No test framework exists — don't invent test commands" gotcha); final verification pass.

**Acceptance criteria:**
- [ ] `package.json` clean of Lingui (no `@lingui/*`, no `eslint-plugin-lingui`); `pnpm install` lockfile consistent
- [ ] `rg -i "lingui"` over repo (excluding node_modules/.git) returns nothing
- [ ] `AGENTS.md` updated: `pnpm test` in Commands, "no test framework" gotcha removed, i18n gotcha rewritten for JSON catalogs + manual string maintenance
- [ ] `.po` files and `lingui.config.ts` deleted

**Verification:**
- [ ] `pnpm build` succeeds (tsc -b typecheck included)
- [ ] `pnpm lint` succeeds
- [ ] `pnpm test` succeeds
- [ ] `pnpm dev`: full manual pass — switcher + `?lang=es` override, localStorage `lang` persistence, navigator-language default, `document.documentElement.lang` set correctly

**Dependencies:** Tasks 1-7

**Files likely touched:**
- `package.json`
- `AGENTS.md`
- `src/i18n/locales/{en,es}.po` (deleted)
- `lingui.config.ts` (deleted)

**Estimated scope:** Small (2-4 files)
