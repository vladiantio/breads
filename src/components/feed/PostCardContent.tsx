import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  Facet
} from '@atproto/api';
import HLSPlayer from '../shared/HLSPlayer';
import { RichTextRenderer } from '../shared/RichTextRenderer';
import { ThreadContentRenderer } from '../shared/ThreadContentRenderer';
import { EmbedExternal } from './EmbedExternal';
import { EmbedToggle } from './EmbedToggle';

interface PostCardContentProps {
  fromATP: boolean;
  content: string;
  facets?: Facet[];
  embedImages?: AppBskyEmbedImages.ViewImage[];
  embedVideo?: AppBskyEmbedVideo.View;
  embedExternal?: AppBskyEmbedExternal.ViewExternal;
}

const PostCardContent: React.FC<PostCardContentProps> = ({
  fromATP,
  content,
  facets,
  embedImages,
  embedVideo,
  embedExternal,
}) => {
  return (
    <>
      {content
        ? fromATP
          ? <RichTextRenderer text={content} facets={facets} />
          : <ThreadContentRenderer content={content} />
        : null}

      {embedImages && embedImages.length > 0 && (
        <EmbedToggle className="mt-3" label="images">
          <div className="mt-2 flex gap-x-2">
            {embedImages.map(image => (
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
      )}

      {embedVideo !== undefined ? (
        <EmbedToggle className="mt-3" label="video">
          <div
            className="mt-2 max-h-[26rem] w-fit"
            style={{
              aspectRatio: embedVideo.aspectRatio ? embedVideo.aspectRatio.width / embedVideo.aspectRatio.height : undefined
            }}
          >
            <HLSPlayer
              autoPlay
              className="max-h-full max-w-full rounded-lg border object-contain"
              src={embedVideo.playlist}
              width={embedVideo.aspectRatio?.width}
              height={embedVideo.aspectRatio?.height}
              poster={embedVideo.thumbnail}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </EmbedToggle>
      ) : null}

      {embedExternal && (
        <EmbedExternal view={embedExternal} />
      )}
    </>
  );
};

export default PostCardContent;
