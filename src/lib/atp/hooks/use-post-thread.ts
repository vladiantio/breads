import { useQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { mapThreads } from '../map';

interface UsePostThread {
  uri?: string
}

export function usePostThread({ uri }: UsePostThread) {
  const { agent } = useAtpStore();

  return useQuery({
    queryKey: ['post-thread', { uri }],
    queryFn: async () => {
      if (!uri) throw new Error('No URI provided');

      const { data: { thread } } = await agent.getPostThread({
        uri,
        depth: 10,
      });

      return mapThreads(thread);
    },
    enabled: !!agent && !!uri,
  });
}
