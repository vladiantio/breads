import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/$username')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
