import { AppBskyEmbedVideo } from "@atcute/bluesky";
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
import { calculateAspectRatio } from "@/utils/media";
import { useAppSettings } from "@/features/settings/app-settings-context";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/ui/button";
import { EyeIcon } from "lucide-react";

interface EmbedVideoProps {
  view: AppBskyEmbedVideo.View
}

export function EmbedVideo({ view }: EmbedVideoProps) {
  const aspectRatio = calculateAspectRatio(view.aspectRatio?.width, view.aspectRatio?.height)
  const { hideMedia } = useAppSettings()
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)
  const hidden = hideMedia && !revealed

  const player = (
    <div
      className="bg-accent border overflow-hidden rounded-lg select-none h-full max-h-[30rem] w-auto relative z-20"
      style={{ aspectRatio }}
    >
      <MediaPlayer className="size-full" autoHide>
        <MediaPlayerVideo
          render={
            <HLSPlayer
              src={view.playlist}
              poster={view.thumbnail}
              playsInline
              className="size-full"
            />
          }
        />
        <MediaPlayerError />
        <MediaPlayerVolumeIndicator />
        <MediaPlayerControls placement="middle">
          <MediaPlayerPlay
            className="bg-background/30 rounded-full size-16 [&_svg:not([class*='size-'])]:size-8"
          />
        </MediaPlayerControls>
        <MediaPlayerControls
          placement="bottom"
          className="flex-col items-start gap-1 [:fullscreen_&]:gap-3"
        >
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
  )

  if (!hidden) return player

  return (
    <div className="relative z-20">
      <div
        className="bg-accent border overflow-hidden rounded-lg select-none h-full max-h-[30rem] w-auto pointer-events-none blur-md"
        style={{ aspectRatio }}
        aria-hidden
      >
        {view.thumbnail && (
          <img
            src={view.thumbnail}
            alt={view.alt}
            className="size-full object-contain"
            loading="lazy"
          />
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setRevealed(true)}
        >
          <EyeIcon />
          {t("post.embed.show")} {t("post.embed.video")}
        </Button>
      </div>
    </div>
  );
}
