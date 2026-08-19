import { describe, expect, it } from "vitest"
import { getEmbedImageFrameStyle } from "./media"

describe("getEmbedImageFrameStyle", () => {
  it("keeps a small single image at its intrinsic width", () => {
    expect(getEmbedImageFrameStyle(1, 1, 180)).toEqual({
      flexBasis: undefined,
      width: "min(100%, 180px, 30rem)",
      aspectRatio: 1,
    })
  })

  it("caps a large single image at the media height limit", () => {
    expect(getEmbedImageFrameStyle(1, 0.75, 750)).toEqual({
      flexBasis: undefined,
      width: "min(100%, 750px, 22.5rem)",
      aspectRatio: 0.75,
    })
  })

  it("uses the aspect-ratio limit when intrinsic dimensions are unavailable", () => {
    expect(getEmbedImageFrameStyle(1, 1.5)).toEqual({
      flexBasis: undefined,
      width: "min(100%, 45rem)",
      aspectRatio: 1.5,
    })
  })

  it("uses flex-basis for multi-image rows without forcing a width", () => {
    expect(getEmbedImageFrameStyle(2, 0.75, 180)).toEqual({
      flexBasis: "75%",
      width: undefined,
      aspectRatio: 0.75,
    })
  })
})
