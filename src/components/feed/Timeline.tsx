import { CreatePost } from "./CreatePost";
import { FeedTabs } from "./FeedTabs";
import { Button } from "../ui/button";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { useFeed } from "@/lib/atp/hooks/use-feed";
import { useMemo } from "react";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { useAtpStore } from "@/lib/atp/store";
import { PostFeed } from "./PostFeed";

export function Timeline() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useFeed();

  const { isAuthenticated } = useAtpStore();

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data]);

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <FeedTabs />
      {isAuthenticated && (
        <CreatePost />
      )}
      {isLoading ? new Array(30).fill(0).map((_, i) => (
        <PostCardSkeleton key={i} />
      )) : (
        <>
          <PostFeed
            posts={posts}
          />
          {isFetchingNextPage && new Array(30).fill(0).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
          <div className="py-4 text-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage && <Loader2 className="animate-spin" />}
              {hasNextPage
                ? 'Load more'
                : 'Nothing more to load'}
              {hasNextPage && <ArrowDownIcon />}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
