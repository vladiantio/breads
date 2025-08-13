import { Hashtag } from '@/features/search/hashtag'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/hashtag/$tag')({
  loader: ({ params: { tag } }) => tag,
  component: RouteComponent,
})

function RouteComponent() {
  const tag = Route.useLoaderData()

  return <Hashtag tag={tag} />
}
