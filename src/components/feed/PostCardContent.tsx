import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  Facet
} from '@atproto/api';
import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon
} from 'lucide-react';
import HLSPlayer from '../shared/HLSPlayer';
import { RichTextRenderer } from '../shared/RichTextRenderer';
import { ThreadContentRenderer } from '../shared/ThreadContentRenderer';
import { Button } from '../ui/button';

interface PostCardContentProps {
  fromATP: boolean;
  content: string;
  facets?: Facet[];
  embedImages?: AppBskyEmbedImages.ViewImage[];
  embedVideo?: AppBskyEmbedVideo.View;
  embedExternal?: AppBskyEmbedExternal.ViewExternal;
  showEmbed: boolean;
  onEmbedToggle: (e: React.MouseEvent) => void;
}

const PostCardContent: React.FC<PostCardContentProps> = ({
  fromATP,
  content,
  facets,
  embedImages,
  embedVideo,
  embedExternal,
  showEmbed,
  onEmbedToggle,
}) => {
  return (
    <>
      {content
        ? fromATP
          ? <RichTextRenderer text={content} facets={facets} />
          : <ThreadContentRenderer content={content} />
        : null}

      {embedImages && embedImages.length > 0
        && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={onEmbedToggle}
            className="mt-3"
          >
            { showEmbed ? <EyeOffIcon /> : <EyeIcon /> }
            { showEmbed ? 'Hide' : 'Show' } images
          </Button>

          {showEmbed && (
            <div className="mt-2 flex gap-x-2">
              {embedImages.map(image => (
                <div
                  className="max-h-[26rem]"
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
          )}
        </>
      )}

      {embedVideo !== undefined ? (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={onEmbedToggle}
            className="mt-3"
          >
            { showEmbed ? <EyeOffIcon /> : <EyeIcon /> }
            { showEmbed ? 'Hide' : 'Show' } video
          </Button>

          {showEmbed && (
            <div
              className="mt-2 max-h-[26rem]"
              style={{
                aspectRatio: embedVideo.aspectRatio ? embedVideo.aspectRatio.width / embedVideo.aspectRatio.height : undefined
              }}
            >
              <HLSPlayer
                autoPlay
                className="max-h-full max-w-full rounded-lg border object-cover"
                src={embedVideo.playlist}
                width={embedVideo.aspectRatio?.width}
                height={embedVideo.aspectRatio?.height}
                poster={embedVideo.thumbnail}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      ) : null}

      {embedExternal && (
        <div className="mt-3 bg-background border rounded-lg overflow-hidden relative transition-[scale] active:scale-[98%]">
          {embedExternal.thumb && (
            <div className="bg-secondary border-b">
              <img
                src={embedExternal.thumb}
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
              {new URL(embedExternal.uri).hostname.replace('www.', '')}
            </small>
            <a
              className="line-clamp-2 text-pretty before:absolute before:inset-0 before:block before:size-full"
              href={embedExternal.uri}
              rel="noopener noreferrer"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {embedExternal.title}
            </a>
            {embedExternal.description ? <small className="line-clamp-1">{embedExternal.description}</small> : null}
          </div>
        </div>
      )}
    </>
  );
};

export default PostCardContent;
