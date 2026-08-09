import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { ok } from '@atcute/client';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/response-schema';
import { mapPosts } from '../map';

export function useTimeline() {
  const { client } = useAtpStore();

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['timeline'],
    queryFn: async ({ pageParam: cursor }) => {
      const data = await ok(client.get('app.bsky.feed.getTimeline', {
        params: { cursor, limit: 30 }
      }));

      const posts = mapPosts(data.feed);

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!client,
    staleTime: Infinity,
  });
}
