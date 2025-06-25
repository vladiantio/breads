import { AppBskyEmbedVideo } from "@atproto/api";
import { EmbedToggle } from "./EmbedToggle";
import { useImagePreload } from "@/hooks/use-image-preload";
import { t } from "@lingui/core/macro";
import {
  MediaPlayer,
  MediaPlayerVideo,
  MediaPlayerLoading,
  MediaPlayerError,
  MediaPlayerVolumeIndicator,
  MediaPlayerControls,
  MediaPlayerControlsOverlay,
  MediaPlayerSeek,
  MediaPlayerPlay,
  MediaPlayerVolume,
  MediaPlayerTime,
  MediaPlayerSettings,
  MediaPlayerFullscreen,
} from "@/ui/media-player";
import MuxVideo from "@mux/mux-video-react";

interface EmbedVideoProps {
  view: AppBskyEmbedVideo.View
}

export function EmbedVideo({ view }: EmbedVideoProps) {
  const { hoverProps } = useImagePreload(view.thumbnail);

  return (
    <EmbedToggle
      label={t`video`}
      {...hoverProps}
    >
      <div
        className="grid grid-cols-1 grid-rows-1 max-h-[30rem]"
        style={{
          aspectRatio: view.aspectRatio ? view.aspectRatio.width / view.aspectRatio.height : 1
        }}
      >
        <div className="bg-accent border overflow-hidden rounded-lg size-full select-none">
          <MediaPlayer autoHide>
            <MediaPlayerVideo asChild>
              <MuxVideo
                autoPlay
                src={view.playlist}
                poster={view.thumbnail}
                type="application/vnd.apple.mpegurl"
              />
            </MediaPlayerVideo>
            <MediaPlayerLoading />
            <MediaPlayerError />
            <MediaPlayerVolumeIndicator />
            <MediaPlayerControls className="flex-col items-start gap-2.5">
              <MediaPlayerControlsOverlay />
              <MediaPlayerSeek />
              <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <MediaPlayerPlay />
                </div>
                <div className="flex items-center gap-2">
                  <MediaPlayerTime />
                  <MediaPlayerVolume />
                  <MediaPlayerSettings />
                  <MediaPlayerFullscreen />
                </div>
              </div>
            </MediaPlayerControls>
          </MediaPlayer>
        </div>
      </div>
    </EmbedToggle>
  );
}
