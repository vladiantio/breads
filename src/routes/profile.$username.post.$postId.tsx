import PostCard from '@/components/feed/PostCard';
import AuthorHeader from '@/components/profile/AuthorHeader';
import { usePostThread } from '@/lib/atp/hooks/use-post-thread';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username/post/$postId')({
  loader: ({ params: { username, postId } }) => `at://${username}/app.bsky.feed.post/${postId}`,
  component: RouteComponent,
})

function RouteComponent() {
  const uri = Route.useLoaderData()

  const {
    data,
    isLoading,
  } = usePostThread({ uri });

  if (isLoading)
    return "Loading...";

  return (
    <>
      <AuthorHeader
        user={data?.post?.author ?? {}}
      />

      {data?.post ? (
        <PostCard
          post={data.post}
          fromATP
          isDetail
        />
      ) : null}

      {data?.replies.map(reply => (reply.post ? (
        <PostCard
          key={reply.post.id}
          fromATP
          post={reply.post}
        />
      ) : null))}
    </>
  )
}
