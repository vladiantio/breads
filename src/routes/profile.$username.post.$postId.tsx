import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username/post/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/$username/post/$postId"!</div>
}
