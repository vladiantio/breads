import { Layout } from '@/components/layout/layout'
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
