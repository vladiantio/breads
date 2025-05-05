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
import { PostWithAuthor } from '@/types/ResponseSchema';
import { EmbedPost } from './EmbedPost';

interface PostCardContentProps {
  fromATP: boolean;
  content: string;
  facets?: Facet[];
  embedImages?: AppBskyEmbedImages.ViewImage[];
  embedVideo?: AppBskyEmbedVideo.View;
  embedExternal?: AppBskyEmbedExternal.ViewExternal;
  embedPost?: PostWithAuthor;
  isDetail: boolean;
}

const PostCardContent: React.FC<PostCardContentProps> = ({
  fromATP,
  content,
  facets,
  embedImages,
  embedVideo,
  embedExternal,
  embedPost,
  isDetail,
}) => {
  return (
    <div className="space-y-4 mt-3">
      {content
        ? fromATP
          ? <RichTextRenderer text={content} facets={facets} />
          : <ThreadContentRenderer content={content} />
        : null}

      {embedImages && embedImages.length > 0 && (
        <EmbedImages
          views={embedImages}
          isDetail={isDetail}
        />
      )}

      {embedVideo && (
        <EmbedVideo view={embedVideo} />
      )}

      {embedExternal && (
        <EmbedExternal view={embedExternal} />
      )}

      {embedPost && (
        <EmbedPost post={embedPost} />
      )}
    </div>
  );
};

export { PostCardContent };
