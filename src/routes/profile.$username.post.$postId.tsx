import PostCard from '@/components/feed/PostCard';
import AuthorHeader from '@/components/profile/AuthorHeader';
import { createAgent, getPostThreads } from '@/lib/atproto-helpers'
import { createFileRoute } from '@tanstack/react-router'

const agent = createAgent()

export const Route = createFileRoute('/profile/$username/post/$postId')({
  loader: ({ params: { username, postId } }) => {
    return getPostThreads(agent, `at://${username}/app.bsky.feed.post/${postId}`);
  },
  component: RouteComponent,
})

function RouteComponent() {
  const thread = Route.useLoaderData()

  return (
    <>
      <AuthorHeader
        user={thread.post?.author ?? {}}
      />

      {thread.post ? (
        <PostCard
          post={thread.post}
          fromATP
          isDetail
        />
      ) : null}

      {thread.replies.map(reply => (reply.post ? (
        <PostCard
          key={reply.post.id}
          fromATP
          post={reply.post}
        />
      ) : null))}
    </>
  )
}
