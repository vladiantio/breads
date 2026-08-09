import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { ok } from '@atcute/client';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/response-schema';
import { mapPostWithAuthor } from '../map';

interface UsePostsSearch {
  q: string
  limit?: number
  sort?: "top" | "latest" | (string & {})
}

export function usePostsSearch({
  q,
  limit = 25,
  sort = 'top',
}: UsePostsSearch) {
  const { client } = useAtpStore();

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['posts-search', { q, limit, sort }],
    queryFn: async ({ pageParam: cursor }) => {
      const data = await ok(client.get('app.bsky.feed.searchPosts', {
        params: { q, limit, sort, cursor }
      }));

      const posts = data.posts.map(post => mapPostWithAuthor(post));

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!client && !!q.trim(),
    staleTime: Infinity,
  });
}
