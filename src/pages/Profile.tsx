import PostCard from "@/components/feed/PostCard";
import PostCardSkeleton from "@/components/feed/PostCardSkeleton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAuthorFeed } from "@/lib/atp/hooks/use-author-feed";
import { useProfile } from "@/lib/atp/hooks/use-profile";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { useMemo } from "react";

function Posts({ handle }: {handle: string}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useAuthorFeed({
    handle
  });

  const posts = useMemo(() => data?.pages.map((page) => page.posts).flat() ?? [], [data]);

  return isLoading ? new Array(30).fill(0).map((_, i) => (
    <PostCardSkeleton key={i} />
  )) : (
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
          {hasNextPage && <ArrowDownIcon />}
        </Button>
      </div>
    </>
  )
}

export function Profile({ handle }: {handle?: string}) {
  const {
    data,
    isLoading,
  } = useProfile({
    handle
  });

  useDocumentTitle(data && (
    data.displayName ? `${data.displayName} (@${data.username})` : `@${data.username}`
  ));

  const isCurrentUser = false;

  if (!handle)
    return "No handle";

  if (isLoading)
    return "Loading...";

  if (!data)
    return "Nothing to show!";

  return <>
    <ProfileHeader user={data} isCurrentUser={isCurrentUser} />

    <Posts handle={handle} />
  </>
}
