import { useQuery } from "@tanstack/react-query";
import { ok } from "@atcute/client";
import { useAtpStore } from "../store";
import type { Handle } from "@atcute/lexicons";

interface UseResolveHandle {
  handle?: string
  enabled?: boolean
}

export function useResolveHandle({
  handle,
  enabled = true,
}: UseResolveHandle) {
  const { client } = useAtpStore();

  return useQuery({
    queryKey: ['resolve-handle', handle],
    queryFn: async () => {
      if (!handle) throw new Error('No handle provided');

      if (handle.startsWith('did:')) {
        return handle;
      }

      const data = await ok(client.get('com.atproto.identity.resolveHandle', {
        params: { handle: handle as Handle }
      }));

      return data.did;
    },
    enabled: enabled && !!client && !!handle,
  })
}
