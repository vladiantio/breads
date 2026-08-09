import { useQuery } from '@tanstack/react-query';
import { ok } from '@atcute/client';
import { useAtpStore } from '../store';
import { mapAuthor } from '../map';
import type { ActorIdentifier } from '@atcute/lexicons';

interface UseProfile {
  actor?: string
  enabled?: boolean
}

export function useProfile({
  actor,
  enabled = true,
}: UseProfile) {
  const { client } = useAtpStore();

  return useQuery({
    queryKey: ['profile', actor],
    queryFn: async () => {
      if (!actor) throw new Error('No actor provided');

      const data = await ok(client.get('app.bsky.actor.getProfile', {
        params: { actor: actor as ActorIdentifier }
      }));

      return mapAuthor(data);
    },
    enabled: enabled && !!client && !!actor,
  });
}
