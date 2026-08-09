import { useAtpStore } from "@/lib/atp/store";
import { useProfile } from "./use-profile";
import { useResolveHandle } from "./use-resolve-handle";

export function useCurrentProfile() {
  const { isAuthenticated, handle } = useAtpStore();

  const {
    data: actor,
    isLoading: isLoadingActor,
  } = useResolveHandle({ handle: handle ?? undefined, enabled: isAuthenticated && !!handle });

  const {
    data,
    isLoading: isLoadingProfile,
  } = useProfile({ actor });

  return {
    data,
    isLoading: isLoadingActor || isLoadingProfile,
    isAuthenticated: isAuthenticated && !!handle,
  };
}
