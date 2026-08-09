import { beforeEach, describe, expect, it } from "vitest"
import { dynamicActivate } from "@/i18n/i18n"
import { sanitizeHandle } from "./handles"

beforeEach(async () => {
  await dynamicActivate("en")
})

describe("sanitizeHandle", () => {
  it("lowercases handles, applies the prefix and forces LTR", () => {
    expect(sanitizeHandle("Alice.bsky.social", "@")).toBe(
      "\u202a@alice.bsky.social\u202c"
    )
    expect(sanitizeHandle("alice.bsky.social")).toBe(
      "\u202aalice.bsky.social\u202c"
    )
  })

  it("marks invalid handles in English by default", () => {
    expect(sanitizeHandle("handle.invalid")).toBe("⚠ Invalid Handle")
  })

  it("marks invalid handles in Spanish after activating es", async () => {
    await dynamicActivate("es")

    expect(sanitizeHandle("handle.invalid")).toBe("⚠ Identificador no válido")

    await dynamicActivate("en")
  })
})
