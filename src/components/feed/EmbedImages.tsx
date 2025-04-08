import { AppBskyEmbedImages } from "@atproto/api";
import { EmbedToggle } from "./EmbedToggle";
import { useImagePreload } from "@/hooks/use-image-preload";

interface EmbedImagesProps {
  views: AppBskyEmbedImages.ViewImage[]
}

export function EmbedImages({ views }: EmbedImagesProps) {
  const { hoverProps } = useImagePreload(views.map(o => o.thumb));

  return (
    <EmbedToggle
      className="mt-3"
      label="images"
      {...hoverProps}
    >
      <div className="mt-2 flex gap-x-2">
        {views.map(image => (
          <div
            key={image.thumb}
            className="max-h-[26rem] w-fit"
            style={{
              aspectRatio: image.aspectRatio ? image.aspectRatio.width / image.aspectRatio.height : undefined
            }}
          >
            <img 
              src={image.thumb} 
              alt={image.alt}
              className="max-h-full max-w-full rounded-lg border object-cover"
              loading="lazy"
              width={image.aspectRatio?.width}
              height={image.aspectRatio?.height}
            />
          </div>
        ))}
      </div>
    </EmbedToggle>
  );
}
