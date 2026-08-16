import { useMemo } from "react"
import { useAuthorFeed } from "@/lib/atp/hooks/use-author-feed"
import { Spinner } from "@/ui/spinner"
import { LoadMoreButton } from "@/components/load-more-button"
import { Gallery } from "./gallery"

export function ProfileVideos({ actor }: { actor: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    actor,
    filter: 'posts_with_video',
  })

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data])

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner />
      </div>
    )

  return (
    <>
      <Gallery
        posts={posts}
      />
      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </>
  )
}
