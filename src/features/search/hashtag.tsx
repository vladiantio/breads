import { t } from "@lingui/core/macro"
import { useRouter } from "@tanstack/react-router"
import { Button } from "@/ui/button"
import { AlertCircleIcon, ArrowDownIcon, ArrowLeft, Loader2 } from "lucide-react"
import { useMemo } from "react"
import { usePostsSearch } from "@/lib/atp/hooks/use-posts-search"
import { PostCardSkeleton } from "../post/components/post-card-skeleton"
import { PostFeed } from "../post/components/post-feed"
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert"

export function Hashtag({ tag }: { tag: string }) {
  const q = `#${tag}`
  const { history } = useRouter()
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch
  } = usePostsSearch({ q })

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data])

  return (
    <>
      <div className="sticky top-0 z-[1] bg-background px-4 h-16 flex items-center justify-between gap-x-4">
        <Button
          variant="ghost"
          className="rounded-full !p-2 -ml-1"
          onClick={() => history.go(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="font-bold flex-1">
          {q}
        </div>
      </div>
      {isLoading ? Array.from({ length: 30 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      )) : (
        <>
          <PostFeed
            posts={posts}
          />
          {isFetchingNextPage && Array.from({ length: 30 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
          {!error && (
            <div className="py-4 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage && <Loader2 className="animate-spin" />}
                {hasNextPage
                  ? t`Load more`
                  : t`Nothing more to load`}
                {hasNextPage && <ArrowDownIcon />}
              </Button>
            </div>
          )}
        </>
      )}
      {error && (
        <div className="p-4">
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>An error has occurred</AlertTitle>
            <AlertDescription>
              <p>{error.message}</p>
              <Button onClick={() => refetch()}>Try again</Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
