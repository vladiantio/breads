import LanguageDetector, { type DetectorOptions } from "i18next-browser-languagedetector"

export const locales = {
  en: "English",
  es: "Español",
} as const

export const defaultLocale = "en"

export type Locale = keyof typeof locales

export const detectionOptions: DetectorOptions = {
  order: ["querystring", "localStorage", "navigator"],
  lookupQuerystring: "lang",
  lookupLocalStorage: "lang",
  caches: [],
}

const detector = new LanguageDetector()
detector.init({}, detectionOptions)

export const detectLocale = (): Locale => {
  const detected = detector.detect()
  const raw = (Array.isArray(detected) ? detected[0] : detected) ?? defaultLocale
  const locale = raw.split("-")[0]
  return (locale in locales ? locale : defaultLocale) as Locale
}
