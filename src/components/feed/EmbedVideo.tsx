import { AppBskyEmbedVideo } from "@atproto/api";
import { EmbedToggle } from "./EmbedToggle";
import HLSPlayer from "../shared/HLSPlayer";
import { useImagePreload } from "@/hooks/use-image-preload";

interface EmbedVideoProps {
  view: AppBskyEmbedVideo.View
}

export function EmbedVideo({ view }: EmbedVideoProps) {
  const { hoverProps } = useImagePreload(view.thumbnail);

  return (
  <EmbedToggle
    className="mt-3"
    label="video"
    {...hoverProps}
  >
    <div
      className="mt-2 max-h-[26rem] w-fit"
      style={{
        aspectRatio: view.aspectRatio ? view.aspectRatio.width / view.aspectRatio.height : undefined
      }}
    >
      <HLSPlayer
        autoPlay
        className="max-h-full max-w-full rounded-lg border object-contain"
        src={view.playlist}
        width={view.aspectRatio?.width}
        height={view.aspectRatio?.height}
        poster={view.thumbnail}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  </EmbedToggle>
  );
}
