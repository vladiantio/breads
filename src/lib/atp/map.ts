import { Reason, PostWithAuthor, ThreadResponseSchema, User } from "@/types/ResponseSchema";
import { $Typed, AppBskyActorDefs, AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedVideo, AppBskyFeedDefs, Facet } from "@atproto/api";

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

export function mapEmbedPostWithAuthor(post: AppBskyEmbedRecord.ViewRecord) {
  const { author } = post;
  const record = post.value;
  const embed = post.embeds?.[0];

  const embedMapped = mapEmbedViews(embed);

  const postWithAuthor: PostWithAuthor =  {
    id: post.cid,
    uri: post.uri,
    author: {
      id: author.did,
      displayName: author.displayName,
      username: author.handle,
      avatar: author.avatar,
    },
    content: record.text as string ?? '',
    facets: record.facets as Facet[] | undefined,
    timestamp: record.createdAt as string,
    likes: post.likeCount ?? 0,
    replies: post.replyCount ?? 0,
    reposts: post.repostCount ?? 0,
    ...embedMapped
  };

  return postWithAuthor;
}

export function mapEmbedViews(embed?:
  | $Typed<AppBskyEmbedImages.View>
  | $Typed<AppBskyEmbedVideo.View>
  | $Typed<AppBskyEmbedExternal.View>
  | $Typed<AppBskyEmbedRecord.View>
  | $Typed<AppBskyEmbedRecordWithMedia.View>
  | { $type: string }
) {
  let postWithAuthor: Partial<PostWithAuthor> = {};

  if (embed?.$type === 'app.bsky.embed.images#view')
    postWithAuthor.embedImages = (embed as $Typed<AppBskyEmbedImages.View>).images;

  if (embed?.$type === 'app.bsky.embed.video#view')
    postWithAuthor.embedVideo = embed as $Typed<AppBskyEmbedVideo.View>;

  if (embed?.$type === 'app.bsky.embed.external#view')
    postWithAuthor.embedExternal = (embed as $Typed<AppBskyEmbedExternal.View>).external;

  if (embed?.$type === 'app.bsky.embed.record#view') {
    if ((embed as $Typed<AppBskyEmbedRecord.View>).record.$type === 'app.bsky.embed.record#viewRecord')
      postWithAuthor.embedPost = mapEmbedPostWithAuthor((embed as $Typed<AppBskyEmbedRecord.View>).record as $Typed<AppBskyEmbedRecord.ViewRecord>);
  }

  if (embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
    if ((embed as $Typed<AppBskyEmbedRecordWithMedia.View>).media.$type === 'app.bsky.embed.external#view')
      postWithAuthor = mapEmbedViews((embed as $Typed<AppBskyEmbedRecordWithMedia.View>).media);

    if ((embed as $Typed<AppBskyEmbedRecordWithMedia.View>).record.record.$type === 'app.bsky.embed.record#viewRecord')
      postWithAuthor.embedPost = mapEmbedPostWithAuthor((embed as $Typed<AppBskyEmbedRecordWithMedia.View>).record.record as $Typed<AppBskyEmbedRecord.ViewRecord>);
  }

  return postWithAuthor;
}

export function mapPostWithAuthor(post: AppBskyFeedDefs.PostView, reason?: Reason) {
  const { author, record, embed } = post;

  const embedMapped = mapEmbedViews(embed);

  const postWithAuthor: PostWithAuthor = {
    id: post.cid,
    uri: post.uri,
    author: {
      id: author.did,
      displayName: author.displayName,
      username: author.handle,
      avatar: author.avatar,
    },
    content: record.text as string ?? '',
    facets: record.facets as Facet[] | undefined,
    timestamp: record.createdAt as string,
    likes: post.likeCount ?? 0,
    replies: post.replyCount ?? 0,
    reposts: post.repostCount ?? 0,
    reason,
    ...embedMapped
  };

  return postWithAuthor;
}

export function mapPosts(feed: AppBskyFeedDefs.FeedViewPost[]): PostWithAuthor[] {
  return feed.map(({ post, reason }) => mapPostWithAuthor(post, reason));
}

export function mapThreads(thread:
  | $Typed<AppBskyFeedDefs.ThreadViewPost>
  | $Typed<AppBskyFeedDefs.NotFoundPost>
  | $Typed<AppBskyFeedDefs.BlockedPost>
  | { $type: string }
): ThreadResponseSchema {
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
