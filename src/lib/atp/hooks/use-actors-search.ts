import { useQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';

interface UseActorsSearch {
  q: string
  limit?: number
}

export function useActorsSearch({
  q,
  limit = 10,
}: UseActorsSearch) {
  const { agent } = useAtpStore();

  return useQuery({
    queryKey: ['actors-search', { q, limit }],
    queryFn: async () => {
      const { data } = await agent.app.bsky.actor.searchActorsTypeahead({ q, limit });
      return data.actors;
    },
    enabled: !!agent && !!q.trim(),
  });
}
