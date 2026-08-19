import { AppBskyEmbedExternal } from "@atcute/bluesky";
import { parseGif } from "@/lib/embed-player";
import { YTEmbed } from "@/components/yt-embed";
import { GlobeIcon } from "lucide-react";

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
  const parsedGif = parseGif(new URL(uri));
  if (parsedGif) {
    return (
      <div
        className="max-h-[26rem] w-fit"
        style={{
          aspectRatio: parsedGif.dimensions.width / parsedGif.dimensions.height
        }}
      >
        <video
          autoPlay
          disablePictureInPicture
          loop
          poster={thumb}
          src={parsedGif.playerUri}
          title={title}
          height={parsedGif.dimensions.height}
          width={parsedGif.dimensions.width}
          className="max-h-full max-w-full rounded-lg border object-contain"
        />
      </div>
    )
  }

  return (
    <div className="mt-4 max-h-[26rem]">
      <img
        src={uri}
        alt={title}
        className="max-h-full max-w-full rounded-lg border object-cover"
        loading="lazy"
      />
    </div>
  )
}

interface EmbedExternalProps {
  view: AppBskyEmbedExternal.ViewExternal
}

export function EmbedExternal({ view }: EmbedExternalProps) {
  if (gifUriRegex.test(view.uri)) {
    return (
      <a
        href={view.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-20"
      >
        <EmbedGif
          thumb={view.thumb}
          title={view.title}
          uri={view.uri}
        />
      </a>
    )
  } else if (ytUriRegex.test(view.uri)) {
    return (
      <YTEmbed
        id={ytUriRegex.exec(view.uri)![1]}
        title={view.title}
        className="relative z-20"
      />
    )
  } else {
    return (
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
}
