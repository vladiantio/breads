import PostCard from '@/components/feed/PostCard'
import ProfileHeader from '@/components/profile/ProfileHeader'
import { getPostWithAuthor, getUserPosts } from '@/data/posts'
import { getCurrentUser, getUserByUsername } from '@/data/users'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/profile/$username')({
  loader: async ({ params: { username } }) => getUserByUsername(username),
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

  const userPosts = useMemo(() => {
    if (!user) return [];
    
    const posts = getUserPosts(user.id);
    return posts.map(post => getPostWithAuthor(post.id)!);
  }, [user]);
  
  const isCurrentUser = user?.id === getCurrentUser().id;

  if (!user)
    return "Nothing to show!";

  return <div className="pb-20 animate-fade-in">
    <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
    
    <div className="px-4 pt-2">
      {userPosts.length > 0 ? (
        <div className="space-y-1">
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
      )}
    </div>
  </div>
}
