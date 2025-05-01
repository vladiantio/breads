import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useAuthorFeed } from "@/lib/atp/hooks/use-author-feed";
import { useMemo, useState } from "react";
import PostCardSkeleton from "../feed/PostCardSkeleton";
import PostCard from "../feed/PostCard";
import { Button } from "../ui/button";
import { ArrowDown, Loader2 } from "lucide-react";

interface ProfileProps {
  actor: string,
  enabled?: boolean,
}

function Posts({ actor, enabled }: ProfileProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    actor,
    typeFilter: 'no_reposts',
    enabled,
  });

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data]);

  if (isLoading)
    return <>
      {new Array(30).fill(0).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </>;

  return (
    <>
      {posts.map((post, postIndex) => (
        <PostCard
          key={postIndex}
          post={post}
          fromATP
        />
      ))}
      {isFetchingNextPage && new Array(30).fill(0).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
      <div className="text-center p-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage && <Loader2 className="animate-spin" />}
          {hasNextPage
            ? 'Load more'
            : 'Nothing more to load'}
          {hasNextPage && <ArrowDown />}
        </Button>
      </div>
    </>
  )
}

function Reposts({ actor, enabled }: ProfileProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    actor,
    typeFilter: 'reposts',
    enabled,
  });

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data]);

  if (isLoading)
    return <>
      {new Array(30).fill(0).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </>;

  return (
    <>
      {posts.map((post, postIndex) => (
        <PostCard
          key={postIndex}
          post={post}
          fromATP
        />
      ))}
      {isFetchingNextPage && new Array(30).fill(0).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
      <div className="text-center p-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage && <Loader2 className="animate-spin" />}
          {hasNextPage
            ? 'Load more'
            : 'Nothing more to load'}
          {hasNextPage && <ArrowDown />}
        </Button>
      </div>
    </>
  )
}

const tabList = [
  { value: 'posts', label: 'Posts', component: Posts },
  { value: 'reposts', label: 'Reposts', component: Reposts },
];

export function ProfileTabs({ actor }: { actor: string }) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <>
      <Tabs
        className="sticky bg-background top-16 z-[1]"
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

      {tabList.map((tab) => (
        <div
          key={`tab-content-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          role="tabpanel"
          hidden={tab.value !== activeTab}
        >
          <tab.component
            actor={actor}
            enabled={tab.value === activeTab}
          />
        </div>
      ))}
    </>
  )
}
