import { Layout } from '@/components/layout/Layout';
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from "@/components/ui/sonner"
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
