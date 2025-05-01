import { useQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { mapThreads } from '../map';
import { responseToThreadNodes } from '../mapping/threads';
import { REPLY_TREE_DEPTH } from '../constants/threads';
import { annotateSelfThread } from '../mapping/threads';

interface UsePostThread {
  uri?: string
}

export function usePostThread({ uri }: UsePostThread) {
  const { agent } = useAtpStore();

  return useQuery({
    gcTime: 0,
    queryKey: ['post-thread', { uri }],
    queryFn: async () => {
      if (!uri) throw new Error('No URI provided');

      const res = await agent.getPostThread({
        uri,
        depth: REPLY_TREE_DEPTH,
      });

      if (res.success) {
        const thread = responseToThreadNodes(res.data.thread);
        annotateSelfThread(thread);
        return mapThreads(thread);
      }

      return mapThreads({type: 'unknown', uri: uri!});
    },
    enabled: !!agent && !!uri,
  });
}
