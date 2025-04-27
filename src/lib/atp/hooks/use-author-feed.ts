import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/ResponseSchema';
import { mapPosts } from '../map';

interface UseAuthorFeed {
  handle: string
  filter?: "posts_and_author_threads" | "posts_with_replies" | "posts_no_replies" | "posts_with_media" | "posts_with_video" | (string & {})
}

export function useAuthorFeed({
  handle,
  filter = 'posts_no_replies',
}: UseAuthorFeed) {
  const { agent } = useAtpStore();

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['author-feed', handle],
    queryFn: async ({ pageParam: cursor }) => {
      const { data } = await agent.getAuthorFeed({
        actor: handle,
        cursor,
        filter,
        includePins: true,
        limit: 30,
      });

      const posts = mapPosts(data.feed);

      return { posts, cursor: data.cursor };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: !!agent,
  });
}
