import { RowVirtualizerDynamic } from "@/ui/virtualizer"
import { PostCard } from "../post/post-card"
import { PostWithAuthor, User } from "@/types/response-schema"

interface PostFeedProps {
  posts: PostWithAuthor[]
  authorFeed?: User
}

export function PostFeed({
  posts,
  authorFeed,
}: PostFeedProps) {
  return (
    <RowVirtualizerDynamic
      items={posts}
      render={(post) => (
        <PostCard
          post={post}
          authorFeed={authorFeed}
        />
      )}
    />
  )
}
