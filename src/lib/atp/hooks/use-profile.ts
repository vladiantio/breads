import { useQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { mapAuthor } from '../map';

interface UseProfile {
  actor?: string
  enabled?: boolean
}

export function useProfile({
  actor,
  enabled = true,
}: UseProfile) {
  const { agent } = useAtpStore();

  return useQuery({
    queryKey: ['profile', actor],
    queryFn: async () => {
      if (!actor) throw new Error('No actor provided');

      const { data } = await agent.getProfile({ actor });

      return mapAuthor(data);
    },
    enabled: enabled && !!agent && !!actor,
  });
}
