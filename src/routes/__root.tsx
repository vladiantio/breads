import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from "@/components/ui/sonner"
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
