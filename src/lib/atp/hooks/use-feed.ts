import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { ok } from '@atcute/client';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/response-schema';
import { mapPosts } from '../map';

export function useFeed() {
  const { client } = useAtpStore();

  const feed = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['feed', { feed }],
    queryFn: async ({ pageParam: cursor }) => {
      if (!feed) throw new Error('Feed not found');

      const data = await ok(client.get('app.bsky.feed.getFeed', {
        params: { feed, cursor, limit: 30 }
      }));

      const posts = mapPosts(data.feed);

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!client && feed !== undefined,
    staleTime: Infinity,
  });
}
