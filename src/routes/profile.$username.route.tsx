import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
