import { useMemo, useState } from "react"
import { CreatePost } from "./components/create-post"
import { FeedTabs } from "./components/feed-tabs"
import { Button } from "@/ui/button"
import { AlertCircleIcon, ArrowDownIcon, Loader2 } from "lucide-react"
import { useFeed } from "@/lib/atp/hooks/use-feed"
import { useTimeline } from "@/lib/atp/hooks/use-timeline"
import { PostCardSkeleton } from "../post/components/post-card-skeleton"
import { useAtpStore } from "@/lib/atp/store"
import { PostFeed } from "../post/components/post-feed"
import { t } from "@lingui/core/macro"
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert"

function FeedContent() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch
  } = useFeed()

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data])

  return (
    <>
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

function TimelineContent() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch
  } = useTimeline()

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data])

  return (
    <>
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

export function Home() {
  const { isAuthenticated } = useAtpStore()
  const [activeTab, setActiveTab] = useState("discover")

  const tabList = [
    { value: "discover", component: FeedContent },
    { value: "following", component: TimelineContent },
  ];

  return (
    <>
      <FeedTabs
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
      {isAuthenticated && (
        <CreatePost />
      )}
      {tabList.map((tab) => tab.value === activeTab ? (
        <div
          key={`tab-content-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          role="tabpanel"
        >
          <tab.component />
        </div>
      ) : null)}
    </>
  )
}
