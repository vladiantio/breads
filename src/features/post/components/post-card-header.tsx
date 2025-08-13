import { formatTimestamp } from "@/utils/date"
import { AuthorLink } from "../../profile/components/author-link"
import { sanitizeHandle } from "@/lib/atp/strings/handles"
import { usePostCard } from "./post-card-context"
import { cn } from "@/lib/utils"

export function PostCardHeader() {
  const {
    post: {
      author,
      timestamp,
    },
    isSameAuthorFeed,
    isDetail,
    isEmbed,
  } = usePostCard()

  return (
    <div className={cn("flex w-full", (isDetail || isEmbed) ? "flex-col h-12" : "items-center gap-x-2")}>
      <AuthorLink
        did={author.id}
        username={author.username}
        displayName={author.displayName}
        verification={author.verification}
        onlyText={isSameAuthorFeed}
      />
      <div className="inline-flex items-center gap-x-2 overflow-hidden text-muted-foreground shrink-[10]">
        <span className="truncate">{sanitizeHandle(author.username, "@")}</span>
        <span aria-hidden="true" role="separator">·</span>
        <time dateTime={timestamp} className="shrink-0">{formatTimestamp(timestamp)}</time>
      </div>
    </div>
  )
}
