import { useQuery } from "@tanstack/react-query";
import { useAtpStore } from "../store";

interface UseResolveHandle {
  handle?: string
  enabled?: boolean
}

export function useResolveHandle({
  handle,
  enabled = true,
}: UseResolveHandle) {
  const { agent } = useAtpStore();

  return useQuery({
    queryKey: ['resolve-handle', handle],
    queryFn: async () => {
      if (!handle) throw new Error('No handle provided');

      if (handle.startsWith('did:')) {
        return handle;
      }

      const { data } = await agent.com.atproto.identity.resolveHandle({ handle });

      return data.did;
    },
    enabled: enabled && !!agent && !!handle,
  })
}
