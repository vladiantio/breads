import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
import { ScrollArea, ScrollBar } from "@/ui/scroll-area"
import { useAuthorFeed } from "@/lib/atp/hooks/use-author-feed"
import { useMemo, useState } from "react"
import { PostCardSkeleton } from "../../post/components/post-card-skeleton"
import { Button } from "@/ui/button"
import { ArrowDown } from "lucide-react"
import { PostFeed } from "../../post/components/post-feed"
import { Gallery } from "./gallery"
import { t } from "@lingui/core/macro"
import { User } from "@/types/response-schema"
import { Spinner } from "@/ui/spinner"

interface ProfileProps {
  actor: string
  user: User
}

function Posts({ actor, user }: ProfileProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    actor,
    typeFilter: 'no_reposts',
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
      <div className="text-center p-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage && <Spinner />}
          {hasNextPage
            ? t`Load more`
            : t`Nothing more to load`}
          {hasNextPage && <ArrowDown />}
        </Button>
      </div>
    </>
  )
}

function Reposts({ actor, user }: ProfileProps) {
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
      <div className="text-center p-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage && <Spinner />}
          {hasNextPage
            ? t`Load more`
            : t`Nothing more to load`}
          {hasNextPage && <ArrowDown />}
        </Button>
      </div>
    </>
  )
}

function Media({ actor }: ProfileProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    actor,
    filter: 'posts_with_media',
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
      <div className="text-center p-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage && <Spinner />}
          {hasNextPage
            ? t`Load more`
            : t`Nothing more to load`}
          {hasNextPage && <ArrowDown />}
        </Button>
      </div>
    </>
  )
}

function Videos({ actor }: ProfileProps) {
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
      <div className="text-center p-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage && <Spinner />}
          {hasNextPage
            ? t`Load more`
            : t`Nothing more to load`}
          {hasNextPage && <ArrowDown />}
        </Button>
      </div>
    </>
  )
}

export function ProfileTabs({
  actor,
  user,
}: {
  actor: string
  user: User
}) {
  const [activeTab, setActiveTab] = useState('posts')

  const tabList = [
    { value: 'posts', label: t`Posts`, component: Posts },
    { value: 'reposts', label: t`Reposts`, component: Reposts },
    { value: 'media', label: t`Media`, component: Media },
    { value: 'videos', label: t`Videos`, component: Videos },
  ]

  return (
    <>
      <Tabs
        className="sticky bg-background top-16 z-[2]"
        variant="underline"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <ScrollArea>
          <TabsList className="p-2 min-w-full">
            {tabList.map((tab) => (
              <TabsTrigger
                key={`tab-${tab.value}`}
                id={`tab-${tab.value}`}
                value={tab.value}
                className="grow"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>

      {tabList.map((tab) => tab.value === activeTab ? (
        <div
          key={`tab-content-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          role="tabpanel"
        >
          <tab.component
            actor={actor}
            user={user}
          />
        </div>
      ) : null)}
    </>
  )
}
