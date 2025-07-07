import { formatTimestamp } from '@/utils/date'
import { AuthorLink } from '../shared/AuthorLink'
import { sanitizeHandle } from '@/lib/atp/strings/handles'
import { usePostCard } from './PostCardContext'

export function PostCardHeader() {
  const {
    post: { 
      author, 
      timestamp,
    },
  } = usePostCard()

  return (
    <div className="h-12">
      <div className="flex items-center">
        <AuthorLink
          did={author.id}
          username={author.username}
          displayName={author.displayName}
          verification={author.verification}
        />
      </div>
      <div className="flex items-center gap-x-2 text-muted-foreground">
        <div className="truncate">{sanitizeHandle(author.username, '@')}</div>
        <div aria-hidden="true" role="separator">·</div>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>
    </div>
  )
}
