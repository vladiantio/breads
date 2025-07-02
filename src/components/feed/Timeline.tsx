import { CreatePost } from "./CreatePost";
import { FeedTabs } from "./FeedTabs";
import { Button } from "@/ui/button";
import { AlertCircleIcon, ArrowDownIcon, Loader2 } from "lucide-react";
import { useFeed } from "@/lib/atp/hooks/use-feed";
import { useMemo } from "react";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { useAtpStore } from "@/lib/atp/store";
import { PostFeed } from "./PostFeed";
import { t } from "@lingui/core/macro";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

export function Timeline() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch
  } = useFeed();

  const { isAuthenticated } = useAtpStore();

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data]);

  return (
    <>
      <FeedTabs />
      {isAuthenticated && (
        <CreatePost />
      )}
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
