import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/response-schema';
import { mapPosts } from '../map';

export function useTimeline() {
  const { agent } = useAtpStore();

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['timeline'],
    queryFn: async ({ pageParam: cursor }) => {
      const { data } = await agent.app.bsky.feed.getTimeline({
        cursor,
        limit: 30
      });

      const posts = mapPosts(data.feed);

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!agent,
    staleTime: Infinity,
  });
}
