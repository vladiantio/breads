import { i18n } from "@lingui/core"

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: string) {
  const { messages } = await import(`@/i18n/locales/${locale}.po`)
  i18n.loadAndActivate({ locale, messages })
  document.documentElement.lang = locale;
}
