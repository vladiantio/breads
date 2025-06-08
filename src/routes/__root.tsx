import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { Toaster } from "@/ui/sonner"
import { useAtpStore } from '@/lib/atp/store';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
  beforeLoad: async ({ location }) => {
    const {
      restoreSession,
      isAuthenticated,
    } = useAtpStore.getState();

    // Attempt to restore the session
    await restoreSession();

    if (location.pathname.startsWith('/login')) {
      // if already authenticated, redirect to root
      if (isAuthenticated) throw redirect({ to: '/' });

      // if not authenticated, proceed to login
      return;
    }

    // redirect /@username to /profile/username
    if (location.pathname.startsWith('/@')) {
      throw redirect({
        to: '/profile/$username',
        params: { username: location.pathname.slice(2) },
      });
    }
  },
});
