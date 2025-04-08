import PostCard from '@/components/feed/PostCard'
import ProfileHeader from '@/components/profile/ProfileHeader'
import { Button } from '@/components/ui/button'
import { createAgent, getActorProfile, getAuthorFeed, getProfile } from '@/lib/atproto-helpers'
import { ResponseSchema } from '@/types/ResponseSchema'
import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowDownIcon } from 'lucide-react'

const agent = createAgent()

const fetchFeed = (did:string, cursor?: string) => {
  return getAuthorFeed(agent, did, cursor);
}

export const Route = createFileRoute('/profile/$username/')({
  loader: ({ params: { username } }) => {
    if (username.startsWith('did:'))
      return getActorProfile(agent, username);
    else
      return getProfile(agent, username);
  },
  notFoundComponent: () => {
    return <div className="feed-container pt-16 text-center">
      <h1 className="text-2xl font-bold mb-4">User not found</h1>
      <p className="text-muted-foreground">The user you're looking for doesn't exist</p>
    </div>
  },
  component: RouteComponent,
})

function RouteComponent() {
  const user = Route.useLoaderData()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['feedData'],
    queryFn: ({ pageParam }) => fetchFeed(user.id, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
  
  const isCurrentUser = false;

  if (!user)
    return "Nothing to show!";

  return <>
    <ProfileHeader user={user} isCurrentUser={isCurrentUser} />

    {error ? 'An error has occurred: ' + error.message : null}

    {data?.pages.map((page, pageIndex) =>
      page.posts.map((post, postIndex) => (
        <PostCard
          key={`${pageIndex}-${postIndex}`}
          post={post}
          fromATP
          isPinned={user.pinnedPost?.cid === post.id}
        />
      )
    ))}
    {isFetching ? (
      <span>Loading...</span>
    ) : (
      <div className="pb-3 text-center">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage}
        >
          {hasNextPage
            ? 'Load more'
            : 'Nothing more to load'}
          {hasNextPage && <ArrowDownIcon />}
        </Button>
      </div>
    )}
    
    {/* {userPosts.length > 0 ? (
      <div>
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-lg font-medium mb-2">No posts yet</p>
        <p className="text-muted-foreground">
          When {isCurrentUser ? 'you post' : `@${user?.username} posts`}, 
          they'll appear here
        </p>
      </div>
    )} */}
  </>
}
