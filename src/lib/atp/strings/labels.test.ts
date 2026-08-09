import { ComAtprotoLabelDefs } from "@atcute/atproto"
import { beforeEach, describe, expect, it } from "vitest"
import { dynamicActivate } from "@/i18n/i18n"
import { labelsToInfo } from "./labels"

const label = (val: string): ComAtprotoLabelDefs.Label => ({
  cts: "2026-01-01T00:00:00.000Z",
  src: "did:example:labeler",
  uri: "at://did:example:repo/app.bsky.feed.post/1",
  val,
})

beforeEach(async () => {
  await dynamicActivate("en")
})

describe("labelsToInfo", () => {
  it("maps content label values to English descriptions", () => {
    expect(labelsToInfo([label("porn")])).toBe("Adult Content")
    expect(labelsToInfo([label("sexual")])).toBe("Adult Content")
    expect(labelsToInfo([label("nudity")])).toBe("Non-sexual Nudity")
    expect(labelsToInfo([label("graphic-media")])).toBe("Graphic Media")
  })

  it("returns undefined for unknown or missing labels", () => {
    expect(labelsToInfo(undefined)).toBeUndefined()
    expect(labelsToInfo([label("something-else")])).toBeUndefined()
    expect(labelsToInfo([label("gore")])).toBeUndefined()
  })

  it("returns Spanish descriptions after activating es", async () => {
    await dynamicActivate("es")

    expect(labelsToInfo([label("porn")])).toBe("Contenido para adultos")
    expect(labelsToInfo([label("nudity")])).toBe("Desnudez no sexual")
    expect(labelsToInfo([label("graphic-media")])).toBe("Contenido gráfico")

    await dynamicActivate("en")
  })
})
