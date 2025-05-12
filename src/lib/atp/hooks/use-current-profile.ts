import { useAtpStore } from "@/lib/atp/store";
import { useProfile } from "./use-profile";
import { useResolveHandle } from "./use-resolve-handle";

export function useCurrentProfile() {
  const { isAuthenticated, session } = useAtpStore();

  const {
    data: actor,
    isLoading: isLoadingActor,
  } = useResolveHandle({ handle: session?.handle, enabled: isAuthenticated && !!session });

  const {
    data,
    isLoading: isLoadingProfile,
  } = useProfile({ actor });

  return {
    data,
    isLoading: isLoadingActor || isLoadingProfile,
    isAuthenticated: isAuthenticated && !!session,
  };
}
