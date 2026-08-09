import { describe, expect, it } from "vitest"
import { convertRichTextToPlainText } from "./utils"
import type { AppBskyRichtextFacet } from "@atcute/bluesky"

const linkFacet = (byteStart: number, byteEnd: number, uri: string): AppBskyRichtextFacet.Main => ({
  $type: "app.bsky.richtext.facet",
  index: { byteStart, byteEnd },
  features: [{ $type: "app.bsky.richtext.facet#link", uri: uri as `https://${string}` }],
})

const mentionFacet = (byteStart: number, byteEnd: number, did: string): AppBskyRichtextFacet.Main => ({
  $type: "app.bsky.richtext.facet",
  index: { byteStart, byteEnd },
  features: [{ $type: "app.bsky.richtext.facet#mention", did: did as `did:${string}:${string}` }],
})

describe("convertRichTextToPlainText", () => {
  it("replaces an ASCII link facet with its uri", () => {
    const text = "check this https://example.com/foo now"
    expect(convertRichTextToPlainText(text, [linkFacet(11, 34, "https://example.com/foo")])).toBe(text)
  })

  it("uses the facet uri when it differs from the display text", () => {
    const text = "visit https://short.com now"
    expect(convertRichTextToPlainText(text, [linkFacet(6, 23, "https://example.com/long")])).toBe("visit https://example.com/long now")
  })

  it("handles emoji before a link facet (UTF-8 byte offsets)", () => {
    const text = "😀 check https://example.com"
    expect(convertRichTextToPlainText(text, [linkFacet(11, 30, "https://example.com")])).toBe(text)
  })

  it("keeps mention facets as plain text", () => {
    const text = "hi @alice!"
    expect(convertRichTextToPlainText(text, [mentionFacet(3, 10, "did:plc:alice")])).toBe(text)
  })

  it("handles emoji before a mention facet", () => {
    const text = "😀 hey @user"
    expect(convertRichTextToPlainText(text, [mentionFacet(9, 14, "did:plc:user")])).toBe(text)
  })

  it("returns the text unchanged when there are no facets", () => {
    expect(convertRichTextToPlainText("plain text")).toBe("plain text")
    expect(convertRichTextToPlainText("plain text", undefined)).toBe("plain text")
  })

  it("ignores facets with inverted byte ranges", () => {
    expect(convertRichTextToPlainText("hello", [linkFacet(99, 0, "https://example.com")])).toBe("hello")
  })
})
