import { Layout } from '@/layouts/layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}
