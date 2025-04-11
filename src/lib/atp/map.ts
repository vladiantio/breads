import { Reason, PostWithAuthor, ThreadResponseSchema, User } from "@/types/ResponseSchema";
import { $Typed, AppBskyActorDefs, AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedVideo, AppBskyFeedDefs, Facet } from "@atproto/api";

export function mapAuthor(author: AppBskyActorDefs.ProfileViewDetailed): User {
  return {
    id: author.did,
    username: author.handle,
    avatar: author.avatar,
    banner: author.banner,
    bio: author.description ?? '',
    displayName: author.displayName!,
    followers: author.followersCount ?? 0,
    following: author.followsCount ?? 0,
  };
}

export function mapPostWithAuthor(post: AppBskyFeedDefs.PostView, reason?: Reason): PostWithAuthor {
  return {
    id: post.cid,
    uri: post.uri,
    author: {
      id: post.author.did,
      displayName: post.author.displayName,
      username: post.author.handle,
      avatar: post.author.avatar,
    },
    content: post.record.text as string ?? '',
    facets: post.record.facets as Facet[] | undefined,
    timestamp: post.record.createdAt as string,
    likes: post.likeCount ?? 0,
    replies: post.replyCount ?? 0,
    reposts: post.repostCount ?? 0,
    embedImages: post.embed?.$type === 'app.bsky.embed.images#view' ? (post.embed as $Typed<AppBskyEmbedImages.View>).images : undefined,
    embedVideo: post.embed?.$type === 'app.bsky.embed.video#view' ? (post.embed as $Typed<AppBskyEmbedVideo.View>) : undefined,
    embedExternal: post.embed?.$type === 'app.bsky.embed.external#view' ? (post.embed as $Typed<AppBskyEmbedExternal.View>).external : undefined,
    reason,
  };
}

export function mapPosts(feed: AppBskyFeedDefs.FeedViewPost[]): PostWithAuthor[] {
  return feed.map(({ post, reason }) => mapPostWithAuthor(post, reason));
}

export function mapThreads(thread:
  | $Typed<AppBskyFeedDefs.ThreadViewPost>
  | $Typed<AppBskyFeedDefs.NotFoundPost>
  | $Typed<AppBskyFeedDefs.BlockedPost>
  | { $type: string }): ThreadResponseSchema {
  if (thread.$type === 'app.bsky.feed.defs#threadViewPost') {
    const { post, replies } = thread as $Typed<AppBskyFeedDefs.ThreadViewPost>;
    return {
      post: mapPostWithAuthor(post),
      replies: replies?.filter(thread => thread.$type === 'app.bsky.feed.defs#threadViewPost')
        .map(thread => mapThreads(thread)) ?? []
    }
  } else {
    return {
      post: undefined,
      replies: []
    };
  }
}
