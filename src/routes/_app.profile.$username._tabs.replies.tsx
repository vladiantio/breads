import { ProfileReplies } from '@/features/profile/components/profile-replies'
import { useProfile } from '@/lib/atp/hooks/use-profile'
import { useResolveHandle } from '@/lib/atp/hooks/use-resolve-handle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/$username/_tabs/replies')({
  component: RouteComponent,
})

function RouteComponent() {
  const username = Route.useParams().username

  const { data: actor } = useResolveHandle({ handle: username })
  const { data: user } = useProfile({ actor })

  if (!actor || !user)
    return null

  return <ProfileReplies actor={actor} user={user} />
}
