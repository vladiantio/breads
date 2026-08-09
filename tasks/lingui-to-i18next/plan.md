# Implementation Plan: Migrate from Lingui to i18next + react-i18next

## Overview

Replace the Lingui stack (`@lingui/core`, `@lingui/react`, `@lingui/detect-locale`, `@lingui/cli`, babel/vite plugins, `eslint-plugin-lingui`) with `i18next` + `react-i18next`. The codebase uses only flat string translations: 84 messages in `en.po`/`es.po`, no plurals, no `select`/`msg` macros, and only two interpolated strings (`Reposted by {repostedBy}`, `...and {moreTagsCount}+`). 28 app files import Lingui macros (`t` template literals and `<Trans>` JSX).

## Architecture Decisions

- **Key strategy: semantic keys** (user decision). Every msgid is mapped to a semantic key grouped by domain: `common.cancel`, `nav.home`, `auth.username`, `post.actions.copyLink`, `settings.colorMode`, `labels.adultContent`. Convention: `{domain}.{context}` in camelCase; domains mirror existing feature areas: `common`, `nav`, `auth`, `feed`, `post`, `profile`, `search`, `settings`, `labels`, `toast`. JSON catalogs are `{ "nav.home": "Home" }` (en) and `{ "nav.home": "Inicio" }` (es). All 83 Spanish translations carry over unchanged — only the key label changes, not the translated text. **The full key table is pinned in the Key Table appendix below; Task 1 transcribes it verbatim** (84 keys + 1 new key `settings.language` added by the Task 7 switcher).
- **Uniform conversion of macros:** every `t\`str\`` → `t("<semantic-key>")` from `useTranslation()` (components) or the exported bound `t` (non-React lib files). Every `<Trans>text</Trans>` → `{t("<semantic-key>")}` inside the same surrounding element. No `Trans` usage involves components, only plain text, so react-i18next `<Trans>` children semantics are avoided entirely.
- **Interpolation: the two `{var}` strings become i18next syntax.** i18next uses double braces with semantic keys: `t("post.repostedBy", { repostedBy })` with `"post.repostedBy": "Reposted by {{repostedBy}}"` in en.json (`"Reposteado por {{repostedBy}}"` in es), and `t("post.tags.more", { moreTagsCount })` with `"...and {{moreTagsCount}}+`.
- **Catalogs stay lazy-loaded.** `dynamicActivate(locale)` keeps the `import(\`@/i18n/locales/${locale}.json\`)` pattern, then `i18n.addResourceBundle(locale, "translation", messages)` + `i18n.changeLanguage(locale)`. `document.documentElement.lang` behavior preserved.
- **Locale detection via `i18next-browser-languagedetector`.** `languages.ts` configures a detector with `order: ['querystring', 'localStorage', 'navigator']`, `lookupQuerystring: 'lang'`, `lookupLocalStorage: 'lang'` — same semantics and precedence as today (`?lang=` → localStorage → navigator). i18next init adds `supportedLngs: ['en', 'es']`, `load: 'languageOnly'` (normalizes `es-MX` → `es`, preserving the old `.split("-")[0]` behavior), and `fallbackLng: defaultLocale`. `detectLocale()` stays exported for `app.tsx` but is implemented via the detector (or detection runs inside `i18n.init` and `dynamicActivate` resolves the locale from the detected value).
- **No http backend.** Resources are bundled and lazy-loaded as before; only detection is delegated to the package.
- **Language switcher** (new scope, user decision): Settings gains a language selector (RadioGroup matching the existing "Color mode" pattern) listing the `locales` map from `languages.ts`. Switching calls `i18n.changeLanguage(locale)`, persists `lang` to localStorage (same key the detector reads), sets `document.documentElement.lang`, and strips a stale `?lang=` querystring param via `history.replaceState` so the persisted choice wins on reload. Components re-render via `useTranslation`; the call-time `t` in lib files picks up the change immediately.
- **`I18nProvider` stays** as a thin `I18nextProvider` wrapper so `app.tsx` is untouched.
- **i18next init hardening:** `interpolation: { escapeValue: false }` (React escapes), `react: { useSuspense: false }` (resources are loaded before first render via awaited `dynamicActivate` in `app.tsx`), `initImmediate: false`.
- **Non-React `t`:** `src/lib/atp/strings/labels.ts` and `handles.ts` import a bound `t` re-exported from `src/i18n/i18n.ts` (called at call-time, same as today with the macro).
- **Module-level `t`:** none exists — verified `settings.tsx`'s `themeOptions` array is inside the component, so `useTranslation()` works everywhere in React code.
- **Testing with Vitest** (new — project has no test framework today): `vitest` + `happy-dom` dev deps, `test` config block in `vite.config.ts` (`environment: 'happy-dom'`, needed for `URL`/`localStorage`/`navigator` in the detector tests), `"test": "vitest run"` script. Unit tests are colocated in `src/` (`*.test.ts`) so `tsc -b` strict-typechecks them as part of `pnpm build`; they import from `vitest` explicitly (no globals). Scope: i18n infra (`languages.ts` detection precedence, `i18n.ts` activation + `t`), catalog integrity (en/es key parity, `{{var}}` interpolation syntax), and the pure lib string functions (`labels.ts`, `handles.ts`). Component rendering tests (@testing-library/react) are explicitly out of scope.

## Task List

### Phase 1: Core infrastructure

- [ ] Task 1: i18next core setup — deps (`i18next`, `react-i18next`, `i18next-browser-languagedetector`), `i18n.ts`, `languages.ts`, `i18n-provider.tsx`, JSON catalogs (semantic keys — transcribe Key Table appendix), configs
- [ ] Task 2: Non-React `t` call sites — `labels.ts`, `handles.ts`
- [ ] Task 3: Vitest setup + i18n unit tests — `vite.config.ts` test block, `test` script, `languages`/`i18n`/`catalog`/`labels`/`handles` tests

### Checkpoint: Infrastructure
- [ ] `pnpm build` passes (typecheck + vite build)
- [ ] `pnpm lint` passes (oxlint + eslint, lingui plugin removed)
- [ ] `pnpm test` passes (detection precedence, activation, catalog parity + key coverage)
- [ ] App boots; `?lang=es` renders Spanish, no console errors

### Phase 2: Component migration

- [ ] Task 4: `t` macro → `useTranslation` outside `features/` (components/, ui/, hooks/, routes/) — semantic keys
- [ ] Task 5: `t` + `Trans` → `useTranslation` in `features/` (feed, login, post, profile, search, settings) — semantic keys
- [ ] Task 6: Language switcher in Settings

### Checkpoint: Components
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes (no lingering lingui imports — grep clean)
- [ ] `pnpm test` still green
- [ ] Manual: both locales render correctly, including the two interpolated strings (repost banner, "...and N+ tags")
- [ ] Manual: switcher re-renders UI in both locales, persists across reload, stale `?lang=` no longer overrides

### Phase 3: Cleanup

- [ ] Task 7: Remove Lingui deps, delete `.po` files + `lingui.config.ts`, update AGENTS.md (incl. Vitest command + removal of "no test framework" note), final verification

### Checkpoint: Complete
- [ ] `package.json` has zero `@lingui`/`eslint-plugin-lingui` entries; lockfile regenerated
- [ ] No `lingui` references anywhere (`rg -i lingui src* *.ts *.js *.json *.md` clean)
- [ ] `pnpm build` + `pnpm lint` + `pnpm test` all clean
- [ ] Manual end-to-end: `?lang=es`, localStorage `lang`, navigator default, and `document.documentElement.lang` all correct

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Interpolation syntax mismatch (`{var}` vs `{{var}}`) silently renders raw key | Med | Task 1 converts only the 2 affected keys; Task 5 handles the 2 call sites; manual checkpoint verifies them |
| Semantic-key typo silently renders the key string (no build-time extraction) | Med | `fallbackLng: 'en'`; Task 3 adds a static coverage test asserting every `t("...")` literal in `src/` resolves in en.json; AGENTS.md documents manual key maintenance |
| `react-refresh/only-export-components` lint errors from new imports | Low | Only `t`/`useTranslation` imports added; labels.ts/handles.ts are pure modules |
| Lingui babel plugin removal changes compiled output / routeTree regen | Low | `routeTree.gen.ts` has no i18n content; regen on dev/build is expected and committed as-is |
| Language switch doesn't re-render | Low | No module-level `t` exists (verified); all call sites are hooks or call-time functions |
| Test files break `tsc -b` (noUnusedLocals etc.) or lint | Low | Tests are strict-clean, import `describe/it/expect` from `vitest` explicitly (no globals), colocated in `src/` so build catches them |
| happy-dom URL/localStorage/navigator simulation for detector tests is fiddly | Med | Test via the public `detectLocale()` API (`history.replaceState`, `localStorage.setItem`, `navigator.language` stub) rather than the detector internals |

## Open Questions

- All resolved by user decisions: semantic keys now (follow-up msgid-as-key option dropped), delete `.po` files after conversion, add a language switcher in Settings, unit tests only (no component-rendering tests).

## Key Table (pinned)

The authoritative key→string mapping. `en.json` is `{ "key": "English" }`, `es.json` is `{ "key": "Español" }`. Values below are verbatim from `en.po`/`es.po` (interpolation converted to `{{var}}`); the key column is fixed by this table. Catalogs are flat objects; dotted keys are a naming convention, not nesting.

### nav
| Key | en | es |
|------|----|----|
| `nav.home` | Home | Inicio |
| `nav.search` | Search | Buscar |
| `nav.notifications` | Notifications | Notificaciones |
| `nav.messages` | Messages | Mensajes |
| `nav.profile` | Profile | Perfil |
| `nav.settings` | Settings | Configuración |
| `nav.logout` | Logout | Cerrar sesión |
| `nav.newPost` | New Post | Nueva publicación |

### auth
| Key | en | es |
|------|----|----|
| `auth.login` | Log in | Iniciar sesión |
| `auth.signUp` | Sign Up | Registrarse |
| `auth.signInTitle` | Sign in with your Bluesky account | Inicia sesión con tu cuenta de Bluesky |
| `auth.usernameLabel` | Username or email address | Nombre de usuario o correo electrónico |
| `auth.usernameRequired` | Username or email address is required | Se requiere nombre de usuario o correo electrónico |
| `auth.passwordLabel` | Password | Contraseña |
| `auth.passwordRequired` | Password is required | Se requiere contraseña |
| `auth.twoFactorLabel` | Two-factor confirmation | Confirmación de dos factores |
| `auth.twoFactorRequired` | Two-factor token is required | Se requiere el token de dos factores |
| `auth.twoFactorHint` | Check your email for a sign in code and enter it here. | Revisa tu correo electrónico para obtener un código de inicio de sesión e ingrésalo aquí. |
| `auth.next` | Next | Siguiente |

### common
| Key | en | es |
|------|----|----|
| `common.submit` | Submit | Enviar |
| `common.cancel` | Cancel | Cancelar |
| `common.goBack` | Go back | Volver |
| `common.errors.generic` | An error occurred | Ocurrió un error |
| `common.errors.retryLater` | Please try again later | Por favor, inténtalo de nuevo más tarde |
| `common.pagination.loadMore` | Load more | Cargar más |
| `common.pagination.none` | Nothing more to load | No hay más para cargar |

### post
| Key | en | es |
|------|----|----|
| `post.publish` | Post | Publicar |
| `post.thread` | Thread | Hilo |
| `post.pinned` | Pinned | Fijado |
| `post.repostedBy` | Reposted by {{repostedBy}} | Reposteado por {{repostedBy}} |
| `post.actions.reply` | Reply | Responder |
| `post.actions.repost` | Repost | Repost |
| `post.actions.share` | Share | Compartir |
| `post.actions.like` | Like | Me gusta |
| `post.actions.replyToPost` | Reply to post | Responder a la publicación |
| `post.actions.repostThisPost` | Repost this post | Repostear esta publicación |
| `post.actions.likeThisPost` | Like this post | Dar me gusta a esta publicación |
| `post.actions.shareThisPost` | Share this post | Compartir esta publicación |
| `post.composer.placeholder` | What's happening? | ¿Qué está pasando? |
| `post.menu.copyLink` | Copy link | Copiar enlace |
| `post.menu.copyText` | Copy text | Copiar texto |
| `post.menu.notInterested` | Not interested in this post | No me interesa esta publicación |
| `post.menu.report` | Report post | Reportar publicación |
| `post.tags.showLess` | Show less | Mostrar menos |
| `post.tags.more` | ...and {{moreTagsCount}}+ | ...y {{moreTagsCount}}+ |
| `post.embed.show` | Show | Mostrar |
| `post.embed.hide` | Hide | Ocultar |
| `post.embed.image` | image | imagen |
| `post.embed.images` | images | imágenes |
| `post.embed.video` | video | vídeo |
| `post.translate.action` | Translate | Traducir |
| `post.translate.inProgress` | Translating... | Traduciendo... |
| `post.translate.with` | Translate with | Traducir con |
| `post.translate.done` | Translated with | Traducido con |

### toast
| Key | en | es |
|------|----|----|
| `toast.shareOptions` | Share options | Opciones para compartir |
| `toast.shareOptionsDescription` | Copy link, share to other platforms... | Copiar enlace, compartir en otras plataformas... |
| `toast.linkCopied` | Link copied | Enlace copiado |
| `toast.linkCopiedDescription` | Post link copied to clipboard | Enlace de la publicación copiado al portapapeles |
| `toast.textCopied` | Text copied | Texto copiado |
| `toast.textCopiedDescription` | Post text copied to clipboard | Texto de la publicación copiado al portapapeles |
| `toast.reportSubmitted` | Report submitted | Reporte enviado |
| `toast.reportSubmittedDescription` | Thank you for helping keep our community safe | Gracias por ayudar a mantener nuestra comunidad segura |
| `toast.preferenceSaved` | Preference saved | Preferencia guardada |
| `toast.preferenceSavedDescription` | You'll see less content like this | Verás menos contenido como este |

### profile
| Key | en | es |
|------|----|----|
| `profile.followers` | followers | seguidores |
| `profile.follow` | Follow | Seguir |
| `profile.edit` | Edit profile | Editar perfil |
| `profile.tabs.posts` | Posts | Posts |
| `profile.tabs.reposts` | Reposts | Reposts |
| `profile.tabs.media` | Media | Media |
| `profile.tabs.videos` | Videos | Vídeos |

### feed
| Key | en | es |
|------|----|----|
| `feed.tabs.discover` | Discover | Descubre |
| `feed.tabs.following` | Following | Siguiendo |

### search
| Key | en | es |
|------|----|----|
| `search.placeholder` | Search... | Buscar... |

### settings
| Key | en | es |
|------|----|----|
| `settings.colorMode` | Color mode | Modo de color |
| `settings.themePreset` | Theme Preset | Preset de tema |
| `settings.theme.system` | System | Sistema |
| `settings.theme.light` | Light | Claro |
| `settings.theme.dark` | Dark | Oscuro |
| `settings.language` (new — Task 7) | Language | Idioma |

### labels
| Key | en | es |
|------|----|----|
| `labels.adultContent` | Adult Content | Contenido para adultos |
| `labels.nudity` | Non-sexual Nudity | Desnudez no sexual |
| `labels.graphicMedia` | Graphic Media | Contenido gráfico |
| `labels.invalidHandle` | Invalid Handle | Identificador no válido |
