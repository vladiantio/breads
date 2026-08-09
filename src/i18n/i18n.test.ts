import { beforeEach, describe, expect, it } from "vitest"
import { changeLocale, dynamicActivate, i18n, t } from "./i18n"

beforeEach(async () => {
  await dynamicActivate("en")
})

describe("dynamicActivate", () => {
  it("loads the Spanish catalog and switches the active language", async () => {
    await dynamicActivate("es")

    expect(t("nav.home")).toBe("Inicio")
    expect(document.documentElement.lang).toBe("es")
  })

  it("sets the document language on activation", async () => {
    document.documentElement.lang = ""

    await dynamicActivate("es")

    expect(document.documentElement.lang).toBe("es")
  })

  it("keeps English translations working", async () => {
    await dynamicActivate("en")

    expect(t("nav.home")).toBe("Home")
    expect(t("post.actions.repost")).toBe("Repost")
    expect(document.documentElement.lang).toBe("en")
  })

  it("returns the key itself for unknown keys", async () => {
    await dynamicActivate("en")

    expect(t("this.key.does.not.exist")).toBe("this.key.does.not.exist")
  })
})

describe("changeLocale", () => {
  beforeEach(() => {
    localStorage.clear()
    history.replaceState({}, "", "/settings")
  })

  it("persists the choice, activates the locale and strips ?lang=", async () => {
    history.replaceState({}, "", "/settings?lang=en")

    await changeLocale("es")

    expect(localStorage.getItem("lang")).toBe("es")
    expect(i18n.language).toBe("es")
    expect(document.documentElement.lang).toBe("es")
    expect(window.location.search).toBe("")

    await changeLocale("en")

    expect(localStorage.getItem("lang")).toBe("en")
    expect(i18n.language).toBe("en")
  })
})
