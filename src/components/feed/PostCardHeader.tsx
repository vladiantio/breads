import { Link } from '@tanstack/react-router';
import { User } from '@/data/users';
import { formatTimestamp } from '@/utils/date';
import { PostCardMenu, PostCardMenuProps } from './PostCardMenu';
import { AuthorHoverCard } from './AuthorHoverCard';

interface PostCardHeaderProps extends PostCardMenuProps {
  author: Partial<User>;
  timestamp: string;
}

const PostCardHeader: React.FC<PostCardHeaderProps> = ({ 
  author, 
  timestamp,
  ...menuProps
}) => {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2 overflow-hidden text-muted-foreground">
        <AuthorHoverCard did={author.id!}>
          <Link
            to="/profile/$username"
            params={{
              username: author.username!,
            }}
            className="font-semibold text-foreground hover:underline active:opacity-60 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {author.username}
          </Link>
        </AuthorHoverCard>
        <span>·</span>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>

      <PostCardMenu {...menuProps} />
    </div>
  );
};

export default PostCardHeader;
