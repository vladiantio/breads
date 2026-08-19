const aspectRatioMin = 0.5
const aspectRatioMax = 2
const embedImageMaxHeightRem = 30

export const calculateAspectRatio = (width = 1, height = 1) => Math.min(aspectRatioMax, Math.max(aspectRatioMin, width / height))

export const getEmbedImageFrameStyle = (
  imageCount: number,
  aspectRatio: number,
  intrinsicWidth?: number,
) => ({
  flexBasis: imageCount > 1 ? `${aspectRatio * 100}%` : undefined,
  width: imageCount === 1
    ? intrinsicWidth
      ? `min(100%, ${intrinsicWidth}px, ${aspectRatio * embedImageMaxHeightRem}rem)`
      : `min(100%, ${aspectRatio * embedImageMaxHeightRem}rem)`
    : undefined,
  aspectRatio,
})
