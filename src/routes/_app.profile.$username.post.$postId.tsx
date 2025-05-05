import { Post } from '@/pages/Post';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/$username/post/$postId')({
  loader: ({ params: { username, postId } }) => `at://${username}/app.bsky.feed.post/${postId}`,
  component: RouteComponent,
})

function RouteComponent() {
  const uri = Route.useLoaderData()

  return <Post uri={uri} />
}
