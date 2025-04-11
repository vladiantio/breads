import { Profile } from '@/pages/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username/')({
  loader: ({ params: { username } }) => username,
  notFoundComponent: () => {
    return <div className="feed-container pt-16 text-center">
      <h1 className="text-2xl font-bold mb-4">User not found</h1>
      <p className="text-muted-foreground">The user you're looking for doesn't exist</p>
    </div>
  },
  component: RouteComponent,
})

function RouteComponent() {
  const handle = Route.useLoaderData()

  return <Profile handle={handle} />
}
