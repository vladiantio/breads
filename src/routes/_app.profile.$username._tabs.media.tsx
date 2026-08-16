import { ProfileMedia } from '@/features/profile/components/profile-media'
import { useResolveHandle } from '@/lib/atp/hooks/use-resolve-handle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/$username/_tabs/media')({
  component: RouteComponent,
})

function RouteComponent() {
  const username = Route.useParams().username

  const { data: actor } = useResolveHandle({ handle: username })

  if (!actor)
    return null

  return <ProfileMedia actor={actor} />
}
