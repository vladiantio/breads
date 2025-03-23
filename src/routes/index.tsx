import PostCard from '@/components/feed/PostCard'
import { getFeedPosts } from '@/data/posts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      <div>
        {getFeedPosts().map(post => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  )
}
