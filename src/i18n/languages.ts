import { detect } from "@lingui/detect-locale"
import { fromUrl, fromStorage, fromNavigator } from "@lingui/detect-locale"

export const locales = {
  en: "English",
  es: "Español",
}
export const defaultLocale = "en"

// can be a function with custom logic or just a string, `detect` method will handle it
const DEFAULT_FALLBACK = () => defaultLocale;

export const detectLocale = () => {
  const locale = detect(
    fromUrl("lang"),
    fromStorage("lang"),
    fromNavigator(),
    DEFAULT_FALLBACK
  )?.split("-")[0]

  return locale ?? defaultLocale
}
