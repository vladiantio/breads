import { AppBskyEmbedExternal } from "@atcute/bluesky";
import { parseGif } from "@/lib/embed-player";
import { YTEmbed } from "@/components/yt-embed";
import { EyeIcon, GlobeIcon } from "lucide-react";
import {
  MediaPlayer,
  MediaPlayerControls,
  MediaPlayerError,
  MediaPlayerPlay,
  MediaPlayerVideo,
} from "@/ui/media-player";
import { useAppSettings } from "@/features/settings/app-settings-context";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/ui/button";

const gifUriRegex = /\.gif(\?[\w\d=&-]*)?$/;
const ytUriRegex = /(?:(?:youtu.be\/)|(?:\/v\/)|(?:\/u\/\w\/)|(?:\/embed\/)|(?:\/watch\?)|(?:\/shorts\/))\??(?:v=)?([^#&?]*)/;

interface EmbedGifProps {
  uri: string
  title: string
  thumb?: string
}

function EmbedGif({
  title,
  uri,
  thumb,
}: EmbedGifProps) {
  const parsedGif = parseGif(uri);
  if (parsedGif) {
    return (
      <div
        className="max-h-[26rem] w-fit relative z-20"
        style={{
          aspectRatio: parsedGif.dimensions.width / parsedGif.dimensions.height
        }}
      >
        <MediaPlayer className="max-h-full max-w-full" autoHide>
          <MediaPlayerVideo
            render={
              <video
                disablePictureInPicture
                loop
                poster={thumb}
                src={parsedGif.playerUri}
                title={title}
                height={parsedGif.dimensions.height}
                width={parsedGif.dimensions.width}
                className="max-h-full max-w-full rounded-lg border object-contain"
              />
            }
          />
          <MediaPlayerError />
          <MediaPlayerControls placement="middle">
            <MediaPlayerPlay
              className="bg-background/30 rounded-full size-16 [&_svg:not([class*='size-'])]:size-8"
            />
          </MediaPlayerControls>
        </MediaPlayer>
        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-2 bottom-2 dark bg-background/50 text-foreground backdrop-blur-sm py-1.5 px-3 font-bold text-xs rounded-md transition-all hover:bg-accent/50"
        >GIF</a>
      </div>
    )
  }

  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-h-[26rem] w-fit relative z-20"
    >
      <img
        src={uri}
        alt={title}
        className="max-h-full max-w-full rounded-lg border object-cover"
        loading="lazy"
      />
    </a>
  )
}

interface EmbedExternalProps {
  view: AppBskyEmbedExternal.ViewExternal
}

export function EmbedExternal({ view }: EmbedExternalProps) {
  const { hideMedia } = useAppSettings()
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)
  const hidden = hideMedia && !revealed

  let content: React.ReactNode

  if (gifUriRegex.test(view.uri)) {
    content = (
      <EmbedGif
        thumb={view.thumb}
        title={view.title}
        uri={view.uri}
      />
    )
  } else if (ytUriRegex.test(view.uri)) {
    content = (
      <YTEmbed
        id={ytUriRegex.exec(view.uri)![1]}
        title={view.title}
        className="relative z-20"
      />
    )
  } else {
    content = (
      <div className="bg-background border rounded-lg overflow-hidden relative z-20 transition-[scale] active:scale-[98%]">
        {view.thumb && (
          <div className="bg-secondary border-b">
            <img
              src={view.thumb}
              width="1200"
              height="630"
              loading="lazy"
              className="max-h-full max-w-full aspect-[120/63] object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-y-1 py-4 px-4">
          <small className="text-muted-foreground flex items-center gap-x-1">
            <GlobeIcon size="1em" />
            {new URL(view.uri).hostname.replace('www.', '')}
          </small>
          <a
            className="line-clamp-2 text-pretty before:absolute before:inset-0 before:block before:size-full"
            href={view.uri}
            rel="noopener noreferrer"
            target="_blank"
          >
            {view.title}
          </a>
          {view.description ? <small className="line-clamp-1">{view.description}</small> : null}
        </div>
      </div>
    )
  }

  if (!hidden) return content

  return (
    <div className="relative z-20">
      <div className="pointer-events-none blur-md select-none" aria-hidden>
        {content}
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
