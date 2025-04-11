import { AppBskyEmbedExternal } from "@atproto/api";
import { EmbedToggle } from "./EmbedToggle";
import { parseTenorGif } from "@/lib/embed-player";
import YouTubeEmbed from "../shared/YouTubeEmbed";
import { GlobeIcon } from "lucide-react";
import { useImagePreload } from "@/hooks/use-image-preload";

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
  const tenorGif = parseTenorGif(new URL(uri));
  if (tenorGif.success) {
    return (
      <div
        className="mt-2 max-h-[26rem] w-fit"
        style={{
          aspectRatio: tenorGif.dimensions.width / tenorGif.dimensions.height
        }}
      >
        <video
          autoPlay
          disablePictureInPicture
          loop
          poster={thumb}
          src={tenorGif.playerUri}
          title={title}
          height={tenorGif.dimensions.height}
          width={tenorGif.dimensions.width}
          className="max-h-full max-w-full rounded-lg border object-contain"
        />
      </div>
    )
  } else {
    return (
      <div className="mt-2 max-h-[26rem]">
        <img
          src={uri} 
          alt={title}
          className="max-h-full max-w-full rounded-lg border object-cover"
          loading="lazy"
        />
      </div>
    )
  }
}

interface EmbedExternalProps {
  view: AppBskyEmbedExternal.ViewExternal
}

export function EmbedExternal({ view }: EmbedExternalProps) {
  const { hoverProps } = useImagePreload(view.thumb);

  if (gifUriRegex.test(view.uri)) {
    return (
      <EmbedToggle
        className="mt-3"
        label="GIF"
        {...hoverProps}
      >
        <EmbedGif
          thumb={view.thumb}
          title={view.title}
          uri={view.uri}
        />
      </EmbedToggle>
    )
  } else if (ytUriRegex.test(view.uri)) {
    return (
      <YouTubeEmbed
        id={ytUriRegex.exec(view.uri)![1]}
        title={view.title}
        className="mt-3"
        onClick={(e) => e.stopPropagation()}
      />
    )
  } else {
    return (
      <div className="mt-3 bg-background border rounded-lg overflow-hidden relative transition-[scale] active:scale-[98%]">
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
        <div className="flex flex-col gap-y-1 py-3 px-3">
          <small className="text-muted-foreground flex items-center gap-x-1">
            <GlobeIcon size="1em" />
            {new URL(view.uri).hostname.replace('www.', '')}
          </small>
          <a
            className="line-clamp-2 text-pretty before:absolute before:inset-0 before:block before:size-full"
            href={view.uri}
            rel="noopener noreferrer"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            {view.title}
          </a>
          {view.description ? <small className="line-clamp-1">{view.description}</small> : null}
        </div>
      </div>
    )
  }
}
