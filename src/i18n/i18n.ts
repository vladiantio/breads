import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import { defaultLocale, detectionOptions, type Locale } from "./languages"

void i18n.use(LanguageDetector).use(initReactI18next).init({
  supportedLngs: ["en", "es"],
  load: "languageOnly",
  fallbackLng: defaultLocale,
  keySeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  detection: detectionOptions,
})

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: Locale) {
  const { default: messages } = await import(`@/i18n/locales/${locale}.json`)
  i18n.addResourceBundle(locale, "translation", messages)
  await i18n.changeLanguage(locale)
  document.documentElement.lang = locale
}

/**
 * Persist a locale choice so it wins over ?lang= and navigator on reload.
 * The i18next detector never writes localStorage itself (caches: []).
 */
export async function changeLocale(locale: Locale) {
  localStorage.setItem("lang", locale)
  const url = new URL(window.location.href)
  if (url.searchParams.has("lang")) {
    url.searchParams.delete("lang")
    history.replaceState({}, "", url.pathname + url.search + url.hash)
  }
  await dynamicActivate(locale)
}

export { i18n }

export const t = i18n.t
