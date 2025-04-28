// source: https://github.com/bluesky-social/ozone/blob/main/components/common/posts/constants.ts

export type TypeFilterKey =
  | 'no_filter'
  | 'posts_and_author_threads'
  | 'posts_no_replies'
  | 'posts_with_media'
  | 'posts_with_video'
  | 'no_reposts'
  | 'reposts'
  | 'quotes'
  | 'quotes_and_reposts'

export const TypeFiltersByKey: Record<
  TypeFilterKey,
  { key: TypeFilterKey; text: string }
> = {
  no_filter: { key: 'no_filter', text: 'No Filter' },
  posts_and_author_threads: { key: 'posts_and_author_threads', text: 'Posts & Author Threads' },
  posts_no_replies: { key: 'posts_no_replies', text: 'Exclude replies' },
  posts_with_media: { key: 'posts_with_media', text: 'Media Only' },
  posts_with_video: { key: 'posts_with_video', text: 'Videos Only' },
  no_reposts: { key: 'no_reposts', text: 'Exclude reposts' },
  reposts: { key: 'reposts', text: 'Reposts Only' },
  quotes: { key: 'quotes', text: 'Quotes Only' },
  quotes_and_reposts: {
    key: 'quotes_and_reposts',
    text: 'Quotes & Reposts Only',
  },
}
