import { AppBskyEmbedImages } from "@atproto/api"
import { EmbedToggle } from "./embed-toggle"
import { useImagePreload } from "@/hooks/use-image-preload"
import { Carousel, CarouselContent, CarouselItem } from "@/ui/carousel"
import { cn } from "@/lib/utils"
import { t } from "@lingui/core/macro"
import { AltReader } from "./alt-reader"
import { ImageZoom } from "@/ui/image-zoom"

const aspectRatioMin = 0.5
const aspectRatioMax = 2

interface EmbedImagesProps {
  views: AppBskyEmbedImages.ViewImage[]
  isDetail?: boolean
}

export function EmbedImages({ views, isDetail }: EmbedImagesProps) {
  const { hoverProps } = useImagePreload(views.map(o => o.thumb))

  return (
    <EmbedToggle
      label={views.length > 1 ? `${views.length} ${t`images`}` : t`image`}
      {...hoverProps}
    >
      {views.length > 2 ? (
        <Carousel
          className={cn(
            "-mr-4",
            isDetail ? "-ml-4" : "-ml-18",
            "mask-x-from-[calc(100%_-_var(--spacing)_*_4)] mask-x-to-100%",
          )}
          opts={{ dragFree: true }}
          onClick={(e) => e.stopPropagation()}
        >
          <CarouselContent
            className={cn(
              "mr-4 cursor-grab active:cursor-grabbing",
              isDetail ? "ml-2" : "ml-16",
            )}
          >
            {views.map(image => {
              const { aspectRatio } = image
              const aspectRatioValue = Math.min(aspectRatioMax, Math.max(aspectRatioMin, aspectRatio ? aspectRatio.width / aspectRatio.height : 1))
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
      ) : (
        <div
          className="flex gap-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {views.map(image => {
            const { aspectRatio } = image
            const aspectRatioValue = Math.min(aspectRatioMax, Math.max(aspectRatioMin, aspectRatio ? aspectRatio.width / aspectRatio.height : 1))
            return (
              <div
                key={image.thumb}
                className="max-h-[30rem]"
                style={{
                  flexBasis: `${aspectRatioValue * 100}%`,
                }}
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
                    width={image.aspectRatio?.width}
                    height={image.aspectRatio?.height}
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
      )}
    </EmbedToggle>
  )
}
