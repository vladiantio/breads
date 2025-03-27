import CreatePost from '@/components/feed/CreatePost'
import FeedTabs from '@/components/feed/FeedTabs'
import PostCard from '@/components/feed/PostCard'
import { getFeedPosts } from '@/data/posts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      <FeedTabs />
      <CreatePost />
      {getFeedPosts().map(post => (
        <PostCard post={post} />
      ))}
    </>
  )
}
