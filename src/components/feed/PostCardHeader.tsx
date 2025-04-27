import { User } from '@/types/ResponseSchema';
import { formatTimestamp } from '@/utils/date';
import { PostCardMenu, PostCardMenuProps } from './PostCardMenu';
import { AuthorLink } from '../shared/AuthorLink';
import { useSimpleVerificationState } from '@/lib/atp/hooks/use-verification';

interface PostCardHeaderProps extends PostCardMenuProps {
  author: User;
  timestamp: string;
}

const PostCardHeader: React.FC<PostCardHeaderProps> = ({ 
  author, 
  timestamp,
  ...menuProps
}) => {
  const { showBadge } = useSimpleVerificationState({ verification: author.verification });

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2 overflow-hidden text-muted-foreground">
        <AuthorLink
          did={author.id}
          username={author.username}
          showVerifiedBadge={showBadge}
        />
        <span>·</span>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>

      <PostCardMenu {...menuProps} />
    </div>
  );
};

export default PostCardHeader;
