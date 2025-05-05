import { User } from '@/types/ResponseSchema';
import { formatTimestamp } from '@/utils/date';
import { PostCardMenu, PostCardMenuProps } from './PostCardMenu';
import { AuthorLink } from '../shared/AuthorLink';
import { useSimpleVerificationState } from '@/lib/atp/hooks/use-verification';
import { sanitizeHandle } from '@/lib/atp/strings/handles';

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
    <div className="h-12">
      <div className="flex items-center justify-between gap-x-2">
        <AuthorLink
          did={author.id}
          username={author.username}
          displayName={author.displayName}
          showVerifiedBadge={showBadge}
        />

        <PostCardMenu {...menuProps} />
      </div>
      <div className="flex items-center gap-x-1 text-muted-foreground">
        <p className="truncate">{sanitizeHandle(author.username, '@')}</p>
        <span>·</span>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>
    </div>
  );
};

export { PostCardHeader };
