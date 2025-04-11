import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  Facet
} from '@atproto/api';
import { RichTextRenderer } from '../shared/RichTextRenderer';
import { ThreadContentRenderer } from '../shared/ThreadContentRenderer';
import { EmbedExternal } from './EmbedExternal';
import { EmbedImages } from './EmbedImages';
import { EmbedVideo } from './EmbedVideo';

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
    <div className="space-y-4">
      {content
        ? fromATP
          ? <RichTextRenderer text={content} facets={facets} />
          : <ThreadContentRenderer content={content} />
        : null}

      {embedImages && embedImages.length > 0 && (
        <EmbedImages views={embedImages} />
      )}

      {embedVideo !== undefined ? (
        <EmbedVideo view={embedVideo} />
      ) : null}

      {embedExternal && (
        <EmbedExternal view={embedExternal} />
      )}
    </div>
  );
};

export default PostCardContent;
