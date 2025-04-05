import { Link } from '@tanstack/react-router';
import { User } from '@/data/users';
import { formatTimestamp } from '@/utils/date';
import { PostCardMenu, PostCardMenuProps } from './PostCardMenu';

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
        <Link
          to="/profile/$username"
          params={{
            username: author.username!,
          }}
          className="space-x-2 truncate"
        >
          <span className="font-semibold text-foreground hover:underline active:opacity-60">{author.displayName}</span>
          <span>@{author.username}</span>
        </Link>
        <span>·</span>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>

      <PostCardMenu {...menuProps} />
    </div>
  );
};

export default PostCardHeader;
