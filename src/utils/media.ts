const aspectRatioMin = 0.5
const aspectRatioMax = 2

export const calculateAspectRatio = (width = 1, height = 1) => Math.min(aspectRatioMax, Math.max(aspectRatioMin, width / height))
