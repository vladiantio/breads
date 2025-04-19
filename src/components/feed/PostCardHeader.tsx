import { User } from '@/data/users';
import { formatTimestamp } from '@/utils/date';
import { PostCardMenu, PostCardMenuProps } from './PostCardMenu';
import { AuthorLink } from '../shared/AuthorLink';

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
        <AuthorLink username={author.username!} />
        <span>·</span>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>

      <PostCardMenu {...menuProps} />
    </div>
  );
};

export default PostCardHeader;
