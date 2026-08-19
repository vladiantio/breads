import { AppBskyEmbedImages } from "@atcute/bluesky"
import { Carousel, CarouselContent, CarouselItem } from "@/ui/carousel"
import { cn } from "@/lib/utils"
import { AltReader } from "./alt-reader"
import { ImageZoom } from "@/ui/image-zoom"
import { calculateAspectRatio, getEmbedImageFrameStyle } from "@/utils/media"
import { useAppSettings } from "@/features/settings/app-settings-context"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Button } from "@/ui/button"
import { EyeIcon } from "lucide-react"

interface EmbedImagesProps {
  views: AppBskyEmbedImages.ViewImage[]
  isDetail?: boolean
}

export function EmbedImages({ views, isDetail }: EmbedImagesProps) {
  const { hideMedia } = useAppSettings()
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)
  const hidden = hideMedia && !revealed

  const media = views.length > 2
    ? (
      <Carousel
        className={cn(
          "-mr-4 relative z-20",
          isDetail ? "-ml-4" : "-ml-18",
          "mask-x-from-[calc(100%_-_var(--spacing)_*_4)] mask-x-to-100%",
        )}
        opts={{ dragFree: true }}
      >
        <CarouselContent
          className={cn(
            "mr-4 cursor-grab active:cursor-grabbing",
            isDetail ? "ml-2" : "ml-16",
          )}
        >
          {views.map(image => {
            const { aspectRatio } = image
            const aspectRatioValue = calculateAspectRatio(aspectRatio?.width, aspectRatio?.height)
            return (
              <CarouselItem
                key={image.thumb}
                className="pl-2 basis-auto"
              >
                <ImageZoom
                  className="bg-accent border rounded-lg overflow-hidden select-none transition-[scale] active:scale-[98%]"
                  zoomImg={{
                    src: image.fullsize
                  }}
                >
                  <img
                    src={image.thumb}
                    alt={image.alt}
                    className="h-[16rem] w-auto object-contain"
                    loading="lazy"
                    style={{
                      aspectRatio: aspectRatioValue
                    }}
                    width={image.aspectRatio?.width}
                    height={image.aspectRatio?.height}
                  />
                </ImageZoom>
                {image.alt && (
                  <div className="relative">
                    <div className="absolute left-2 bottom-2">
                      <AltReader alt={image.alt} />
                    </div>
                  </div>
                )}
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    )
    : (
      <div className="flex gap-x-2 relative z-20">
        {views.map(image => {
          const { aspectRatio } = image
          const aspectRatioValue = calculateAspectRatio(aspectRatio?.width, aspectRatio?.height)
          const intrinsicWidth = aspectRatio?.width
          const intrinsicHeight = aspectRatio?.height
          return (
            <div
              key={image.thumb}
              className="max-h-[30rem]"
              style={getEmbedImageFrameStyle(views.length, aspectRatioValue, intrinsicWidth)}
            >
              <ImageZoom
                className="h-full w-fit bg-accent border rounded-lg overflow-hidden select-none transition-[scale] active:scale-[98%]"
                zoomImg={{
                  src: image.fullsize
                }}
              >
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="h-full max-h-[30rem] w-auto object-contain"
                  loading="lazy"
                  style={{
                    aspectRatio: aspectRatioValue
                  }}
                  width={intrinsicWidth}
                  height={intrinsicHeight}
                />
              </ImageZoom>
              {image.alt && (
                <div className="relative">
                  <div className="absolute left-4 bottom-4">
                    <AltReader alt={image.alt} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )

  if (!hidden) return media

  return (
    <div className="relative z-20">
      <div className="pointer-events-none blur-md select-none" aria-hidden>
        {media}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setRevealed(true)}
        >
          <EyeIcon />
          {t("post.embed.show")}
        </Button>
      </div>
    </div>
  )
}
