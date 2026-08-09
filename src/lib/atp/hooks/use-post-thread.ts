import { useQuery } from '@tanstack/react-query';
import { ok } from '@atcute/client';
import { useAtpStore } from '../store';
import { mapThreads } from '../map';
import { responseToThreadNodes, sortThread, annotateSelfThread } from '../mapping/threads';
import { REPLY_TREE_DEPTH } from '../constants/threads';
import type { ResourceUri } from '@atcute/lexicons';

interface UsePostThread {
  uri?: string
}

export function usePostThread({ uri }: UsePostThread) {
  const { client, did } = useAtpStore();

  return useQuery({
    gcTime: 0,
    queryKey: ['post-thread', { uri }],
    queryFn: async () => {
      if (!uri) throw new Error('No URI provided');

      const data = await ok(client.get('app.bsky.feed.getPostThread', {
        params: { uri: uri as ResourceUri, depth: REPLY_TREE_DEPTH },
      }));

      const thread = responseToThreadNodes(data.thread);
      annotateSelfThread(thread);
      const sortedThread = sortThread(thread, did ?? undefined);
      return mapThreads(sortedThread);
    },
    enabled: !!client && !!uri,
  });
}
