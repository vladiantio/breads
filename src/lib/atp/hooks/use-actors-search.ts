import { useQuery } from '@tanstack/react-query';
import { ok } from '@atcute/client';
import { useAtpStore } from '../store';

interface UseActorsSearch {
  q: string
  limit?: number
}

export function useActorsSearch({
  q,
  limit = 10,
}: UseActorsSearch) {
  const { client } = useAtpStore();

  return useQuery({
    queryKey: ['actors-search', { q, limit }],
    queryFn: async () => {
      const data = await ok(client.get('app.bsky.actor.searchActorsTypeahead', {
        params: { q, limit }
      }));
      return data.actors;
    },
    enabled: !!client && !!q.trim(),
  });
}
