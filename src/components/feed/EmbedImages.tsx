import { AppBskyEmbedImages } from "@atproto/api";
import { EmbedToggle } from "./EmbedToggle";
import { useImagePreload } from "@/hooks/use-image-preload";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { cn } from "@/lib/utils";

interface EmbedImagesProps {
  views: AppBskyEmbedImages.ViewImage[]
  isDetail: boolean
}

export function EmbedImages({ views, isDetail }: EmbedImagesProps) {
  const { hoverProps } = useImagePreload(views.map(o => o.thumb));

  return (
    <EmbedToggle
      label={views.length > 1 ? `${views.length} images` : 'image'}
      {...hoverProps}
    >
      {views.length > 1 ? (
        <Carousel
          className={cn(
            "mt-4 -mr-4",
            isDetail ? "-ml-4" : "-ml-18",
            "mask-x-from-[calc(100%_-_var(--spacing)_*_4)] mask-x-to-100%",
          )}
          opts={{ dragFree: true }}
        >
          <CarouselContent
            className={cn(
              "gap-x-2 mr-4 cursor-grab active:cursor-grabbing",
              isDetail ? "ml-2" : "ml-16",
            )}
          >
            {views.map(image => (
              <CarouselItem
                key={image.thumb}
                className="pl-2 basis-auto"
              >
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="h-[16rem] w-auto rounded-lg border object-cover"
                  loading="lazy"
                  width={image.aspectRatio?.width}
                  height={image.aspectRatio?.height}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="mt-4 flex gap-x-2">
          <div
            className="max-h-[26rem]"
            style={{
              aspectRatio: views[0].aspectRatio ? views[0].aspectRatio.width / views[0].aspectRatio.height : undefined
            }}
          >
            <img 
              src={views[0].thumb} 
              alt={views[0].alt}
              className="max-h-full max-w-full rounded-lg border object-cover"
              loading="lazy"
              width={views[0].aspectRatio?.width}
              height={views[0].aspectRatio?.height}
            />
          </div>
        </div>
      )}
    </EmbedToggle>
  );
}
