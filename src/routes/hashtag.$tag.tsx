import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hashtag/$tag')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hashtag/$tag"!</div>
}
