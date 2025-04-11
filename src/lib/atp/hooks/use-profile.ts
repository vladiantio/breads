import { useQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { mapAuthor } from '../map';

interface UseProfile {
  handle?: string
}

export function useProfile({ handle }: UseProfile) {
  const { agent } = useAtpStore();

  return useQuery({
    queryKey: ['profile', handle],
    queryFn: async () => {
      if (!handle) throw new Error('No handle provided');

      const { data } = await agent.getProfile({ actor: handle.toLowerCase() });

      return mapAuthor(data);
    },
    enabled: !!agent && !!handle,
  });
}
