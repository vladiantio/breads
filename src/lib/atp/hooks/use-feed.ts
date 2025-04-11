import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/ResponseSchema';
import { mapPosts } from '../map';

export function useFeed() {
  const { agent } = useAtpStore();

  const feed = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['feed', { feed }],
    queryFn: async ({ pageParam: cursor }) => {
      if (!feed) throw new Error('Feed not found');

      const { data } = await agent.app.bsky.feed.getFeed({
        feed,
        cursor,
        limit: 30
      });

      const posts = mapPosts(data.feed);

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!agent && feed !== undefined,
    retry: 1,
    staleTime: Infinity,
  });
}
