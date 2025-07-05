import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  Facet
} from '@atproto/api';
import { RichTextRenderer } from '../shared/RichTextRenderer';
import { EmbedExternal } from './EmbedExternal';
import { EmbedImages } from './EmbedImages';
import { EmbedVideo } from './EmbedVideo';
import { PostWithAuthor } from '@/types/ResponseSchema';
import { EmbedPost } from './EmbedPost';
import { Alert, AlertTitle } from '@/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface PostCardContentProps {
  content: string;
  facets?: Facet[];
  embedImages?: AppBskyEmbedImages.ViewImage[];
  embedVideo?: AppBskyEmbedVideo.View;
  embedExternal?: AppBskyEmbedExternal.ViewExternal;
  embedPost?: PostWithAuthor;
  isDetail: boolean;
  labelInfo?: string;
}

const PostCardContent: React.FC<PostCardContentProps> = ({
  content,
  facets,
  embedImages,
  embedVideo,
  embedExternal,
  embedPost,
  isDetail,
  labelInfo,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {content && content.trim().length > 0
        ? <RichTextRenderer text={content} facets={facets} />
        : null}

      {labelInfo && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>{labelInfo}</AlertTitle>
        </Alert>
      )}

      {!labelInfo && embedImages && embedImages.length > 0 && (
        <EmbedImages
          views={embedImages}
          isDetail={isDetail}
        />
      )}

      {!labelInfo && embedVideo && (
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
