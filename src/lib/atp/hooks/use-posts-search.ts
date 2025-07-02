import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/ResponseSchema';
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
  const { agent } = useAtpStore();

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['posts-search', { q, limit, sort }],
    queryFn: async ({ pageParam: cursor }) => {
      const { data } = await agent.app.bsky.feed.searchPosts({
        q,
        limit,
        sort,
        cursor
      });

      const posts = data.posts.map(post => mapPostWithAuthor(post));

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!agent && !!q.trim(),
    staleTime: Infinity,
  });
}
