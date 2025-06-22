import { User } from '@/types/ResponseSchema';
import { formatTimestamp } from '@/utils/date';
import { PostCardMenu, PostCardMenuProps } from './PostCardMenu';
import { AuthorLink } from '../shared/AuthorLink';
import { sanitizeHandle } from '@/lib/atp/strings/handles';

interface PostCardHeaderProps extends PostCardMenuProps {
  author: User;
  timestamp: string;
}

export function PostCardHeader({ 
  author, 
  timestamp,
  ...menuProps
}: PostCardHeaderProps) {
  return (
    <div className="h-12">
      <div className="flex items-center justify-between gap-x-2">
        <AuthorLink
          did={author.id}
          username={author.username}
          displayName={author.displayName}
          verification={author.verification}
        />

        <PostCardMenu {...menuProps} />
      </div>
      <div className="flex items-center gap-x-2 text-muted-foreground">
        <div className="truncate">{sanitizeHandle(author.username, '@')}</div>
        <div aria-hidden="true" role="separator">·</div>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>
    </div>
  );
}
