import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useAtpStore } from '../store';
import { ResponseSchema } from '@/types/ResponseSchema';
import { mapPosts } from '../map';
import { TypeFilterKey, TypeFiltersByKey } from '../types/TypeFilterKey';
import { AppBskyEmbedRecord, AppBskyFeedDefs } from '@atproto/api';

interface UseAuthorFeed {
  handle: string
  includePins?: boolean
  typeFilter?: TypeFilterKey
  enabled?: boolean
}

export function useAuthorFeed({
  handle,
  includePins = true,
  typeFilter = 'posts_no_replies',
  enabled = true,
}: UseAuthorFeed) {
  const { agent } = useAtpStore();

  return useInfiniteQuery<ResponseSchema, Error, InfiniteData<ResponseSchema>, QueryKey, string | undefined>({
    queryKey: ['author-feed', { handle, includePins, typeFilter }],
    queryFn: async ({ pageParam }) => {
      /* Include client side filters.
       * https://github.com/bluesky-social/ozone/blob/main/components/common/feeds/AuthorFeed.tsx
       */
      const limit = 30
      let filteredFeed: AppBskyFeedDefs.FeedViewPost[] = []
      let cursor = pageParam
      const isPostFilter = [
        TypeFiltersByKey.posts_and_author_threads.key,
        TypeFiltersByKey.posts_no_replies.key,
        TypeFiltersByKey.posts_with_media.key,
        TypeFiltersByKey.posts_with_video.key,
      ].includes(typeFilter)
      const isQuoteOrRepostFilter = [
        TypeFiltersByKey.no_reposts.key,
        TypeFiltersByKey.reposts.key,
        TypeFiltersByKey.quotes.key,
        TypeFiltersByKey.quotes_and_reposts.key,
      ].includes(typeFilter)

      while (filteredFeed.length < limit) {
        const authorFeedParams = {
          limit,
          actor: handle,
          includePins,
          cursor,
          ...(isPostFilter ? { filter: typeFilter } : {}),
        }

        const { data } =
          await agent.app.bsky.feed.getAuthorFeed(authorFeedParams)

        if (!data) {
          break
        }

        // Only repost/quote post filters are applied on the client side
        if (!isQuoteOrRepostFilter) {
          const posts = mapPosts(data.feed)
          return { posts, cursor: data.cursor }
        }

        const newFilteredItems = data.feed.filter((item) => {
          if (typeFilter === TypeFiltersByKey.reposts.key) {
            return AppBskyFeedDefs.isReasonRepost(item.reason)
          }
          if (typeFilter === TypeFiltersByKey.no_reposts.key) {
            return !AppBskyFeedDefs.isReasonRepost(item.reason)
          }
          if (typeFilter === TypeFiltersByKey.quotes.key) {
            // When a quoted post is reposted, we don't want to consider that a quote post
            return (
              AppBskyEmbedRecord.isView(item.post.embed) &&
              !AppBskyFeedDefs.isReasonRepost(item.reason)
            )
          }
          return (
            AppBskyFeedDefs.isReasonRepost(item.reason) ||
            AppBskyEmbedRecord.isView(item.post.embed)
          )
        })

        filteredFeed = [...filteredFeed, ...newFilteredItems]

        // If no more items are available, break the loop to prevent infinite requests
        if (!data.cursor) {
          cursor = data.cursor
          break
        }

        cursor = data.cursor
      }

      const posts = mapPosts(filteredFeed)
      return { posts, cursor }
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined,
    enabled: enabled && !!agent,
  })
}
