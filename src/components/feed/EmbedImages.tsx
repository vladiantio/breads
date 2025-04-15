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
      {views.length > 2 ? (
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
              "mr-4 cursor-grab active:cursor-grabbing",
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
          {views.map(image => (
            <div
              key={image.thumb}
              className="max-h-[26rem]"
              style={{
                flexBasis: image.aspectRatio ? `${image.aspectRatio.width * 100 / image.aspectRatio.height}%` : '100%',
              }}
            >
              <img 
                src={image.thumb} 
                alt={image.alt}
                className="h-full rounded-lg border object-cover"
                loading="lazy"
                width={image.aspectRatio?.width}
                height={image.aspectRatio?.height}
              />
            </div>
          ))}
        </div>
      )}
    </EmbedToggle>
  );
}
