import { AppBskyEmbedVideo } from "@atcute/bluesky";
import { EmbedToggle } from "./embed-toggle";
import { useImagePreload } from "@/hooks/use-image-preload";
import { useTranslation } from "react-i18next";
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
import { HLSPlayer } from "@/components/hls-player";

interface EmbedVideoProps {
  view: AppBskyEmbedVideo.View
}

export function EmbedVideo({ view }: EmbedVideoProps) {
  const { hoverProps } = useImagePreload(view.thumbnail);
  const { t } = useTranslation();

  return (
    <EmbedToggle
      label={t("post.embed.video")}
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
            <MediaPlayerVideo
              render={
                <HLSPlayer
                  autoPlay
                  src={view.playlist}
                  poster={view.thumbnail}
                  playsInline
                />
              }
            />
            <MediaPlayerError />
            <MediaPlayerVolumeIndicator />
            <MediaPlayerControls placement="middle">
              <MediaPlayerPlay className="bg-background/30 rounded-full size-16 [&_svg:not([class*='size-'])]:size-8" />
            </MediaPlayerControls>
            <MediaPlayerControls placement="bottom" className="flex-col items-start gap-1 [:fullscreen_&]:gap-3">
              <MediaPlayerControlsOverlay />
              <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <MediaPlayerTime />
                </div>
                <div className="flex items-center gap-2">
                  <MediaPlayerVolume />
                  <MediaPlayerSettings />
                  <MediaPlayerFullscreen />
                </div>
              </div>
              <MediaPlayerSeek withoutTooltip />
            </MediaPlayerControls>
            <MediaPlayerLoading />
          </MediaPlayer>
        </div>
      </div>
    </EmbedToggle>
  );
}
