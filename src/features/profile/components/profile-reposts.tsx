import { useMemo } from "react"
import { User } from "@/types/response-schema"
import { useAuthorFeed } from "@/lib/atp/hooks/use-author-feed"
import { LoadMoreButton } from "@/components/load-more-button"
import { PostCardSkeleton } from "../../post/components/post-card-skeleton"
import { PostFeed } from "../../post/components/post-feed"

interface ProfileRepostsProps {
  actor: string
  user: User
}

export function ProfileReposts({ actor, user }: ProfileRepostsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    actor,
    filter: 'posts_no_replies',
    typeFilter: 'reposts',
  })

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data])

  if (isLoading)
    return <>
      {Array.from({ length: 30 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </>

  return (
    <>
      <PostFeed
        posts={posts}
        authorFeed={user}
      />
      {isFetchingNextPage && Array.from({ length: 30 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </>
  )
}
