import { beforeEach, describe, expect, it } from "vitest"
import { detectLocale, locales } from "./languages"

const setUrl = (search: string) => {
  history.replaceState({}, "", `/${search}`)
}

const setNavigatorLanguage = (lang: string) => {
  Object.defineProperty(window.navigator, "languages", {
    value: [lang],
    configurable: true,
  })
  Object.defineProperty(window.navigator, "language", {
    value: lang,
    configurable: true,
  })
}

beforeEach(() => {
  localStorage.clear()
  setUrl("")
  setNavigatorLanguage("en-US")
})

describe("detectLocale", () => {
  it("falls back to the default locale when nothing is set", () => {
    expect(detectLocale()).toBe("en")
  })

  it("prefers the ?lang= querystring over localStorage and navigator", () => {
    localStorage.setItem("lang", "en")
    setNavigatorLanguage("fr")
    setUrl("?lang=es")

    expect(detectLocale()).toBe("es")
  })

  it("prefers localStorage over navigator", () => {
    localStorage.setItem("lang", "es")
    setNavigatorLanguage("en")

    expect(detectLocale()).toBe("es")
  })

  it("uses the navigator language when nothing else is set", () => {
    setNavigatorLanguage("es")

    expect(detectLocale()).toBe("es")
  })

  it("normalizes region subtags (es-MX -> es)", () => {
    setNavigatorLanguage("es-MX")

    expect(detectLocale()).toBe("es")
  })

  it("falls back to the default locale for unsupported languages", () => {
    localStorage.setItem("lang", "fr")

    expect(detectLocale()).toBe("en")
  })

  it("recognizes every locale in the locales map", () => {
    for (const locale of Object.keys(locales)) {
      localStorage.setItem("lang", locale)
      expect(detectLocale()).toBe(locale)
    }
  })
})
