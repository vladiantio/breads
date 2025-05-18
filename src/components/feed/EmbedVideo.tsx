import { AppBskyEmbedVideo } from "@atproto/api";
import { EmbedToggle } from "./EmbedToggle";
import { HLSPlayer } from "../shared/HLSPlayer";
import { useImagePreload } from "@/hooks/use-image-preload";

interface EmbedVideoProps {
  view: AppBskyEmbedVideo.View
}

export function EmbedVideo({ view }: EmbedVideoProps) {
  const { hoverProps } = useImagePreload(view.thumbnail);

  return (
  <EmbedToggle
    label="video"
    {...hoverProps}
  >
    <div
      className="grid grid-cols-1 grid-rows-1 max-h-[26rem]"
      style={{
        aspectRatio: view.aspectRatio ? view.aspectRatio.width / view.aspectRatio.height : 1
      }}
    >
      <div className="bg-accent border overflow-hidden rounded-lg size-full select-none">
        <HLSPlayer
          autoPlay
          controls
          className="size-full object-contain"
          src={view.playlist}
          poster={view.thumbnail}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  </EmbedToggle>
  );
}
