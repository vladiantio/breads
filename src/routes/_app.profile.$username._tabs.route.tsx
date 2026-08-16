import { Outlet, createFileRoute } from '@tanstack/react-router'
import { ProfileHeader } from '@/features/profile/components/profile-header'
import { ProfileTabBar } from '@/features/profile/components/profile-tab-bar'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useProfile } from '@/lib/atp/hooks/use-profile'
import { useResolveHandle } from '@/lib/atp/hooks/use-resolve-handle'
import { Alert, AlertTitle } from '@/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

export const Route = createFileRoute('/_app/profile/$username/_tabs')({
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

  const {
    data: actor,
    error: actorError,
    isLoading: isLoadingActor,
  } = useResolveHandle({ handle })

  const {
    data: user,
    error: profileError,
    isLoading: isLoadingProfile,
  } = useProfile({ actor })

  useDocumentTitle(user && (
    user.displayName ? `${user.displayName} (@${user.username})` : `@${user.username}`
  ))

  if (!handle)
    return "No handle"

  if (isLoadingActor || isLoadingProfile)
    return "Loading..."

  if (actorError || profileError)
    return (
      <div className="p-4">
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>{actorError?.message ?? profileError?.message}</AlertTitle>
        </Alert>
      </div>
    )

  if (!actor)
    return "No actor"

  if (!user)
    return "Nothing to show!"

  return <>
    <ProfileHeader user={user} isCurrentUser={false} />

    <ProfileTabBar username={user.username} />

    <Outlet />
  </>
}
