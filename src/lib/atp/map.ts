import { Reason, PostWithAuthor, ThreadResponseSchema, User } from "@/types/ResponseSchema";
import {
  $Typed,
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  Facet,
} from "@atproto/api";
import { AnyProfileView } from "./types/AnyProfileView";
import { ThreadNode } from "./mapping/threads";

export function mapAuthor(author: AnyProfileView): User {
  return {
    id: author.did,
    username: author.handle,
    avatar: author.avatar,
    banner: 'banner' in author ? author.banner : undefined,
    bio: 'description' in author ? author.description : undefined,
    displayName: author.displayName!,
    followers: 'followersCount' in author ? author.followersCount : undefined,
    following: 'followsCount' in author ? author.followsCount : undefined,
    verification: author.verification,
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
    author: mapAuthor(author),
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

export function mapPostWithAuthor(post: AppBskyFeedDefs.PostView, reason?: Reason, isThreadParent?: boolean) {
  const { author, record, embed } = post;

  const embedMapped = mapEmbedViews(embed);

  const postWithAuthor: PostWithAuthor = {
    id: post.cid,
    uri: post.uri,
    author: mapAuthor(author),
    content: record.text as string ?? '',
    facets: record.facets as Facet[] | undefined,
    timestamp: record.createdAt as string,
    likes: post.likeCount ?? 0,
    replies: post.replyCount ?? 0,
    reposts: post.repostCount ?? 0,
    reason,
    isThreadParent,
    ...embedMapped
  };

  return postWithAuthor;
}

export function mapPosts(feed: AppBskyFeedDefs.FeedViewPost[], reduceReplies = true): PostWithAuthor[] {
  if (!reduceReplies) {
    return feed.map(post => mapPostWithAuthor(post.post));
  }
  return feed.reduce((acc: PostWithAuthor[], post) => {
    const postExists = acc.find(o =>
      o.id == post.post.cid
      || (AppBskyFeedDefs.isPostView(post.reply?.root) && o.id == post.reply?.root.cid)
      || (AppBskyFeedDefs.isPostView(post.reply?.parent) && o.id == post.reply?.parent.cid)
    );
  
    if (postExists) {
      return [...acc];
    }
  
    if (!!post.reply && !post.reason) {
      const posts = [];
      if (post.reply.root && AppBskyFeedDefs.isPostView(post.reply.root)) {
        posts.push(mapPostWithAuthor(post.reply.root, undefined, true));
      }
      if (post.reply.parent && AppBskyFeedDefs.isPostView(post.reply.parent) && (!AppBskyFeedDefs.isPostView(post.reply.root) || post.reply.parent.cid !== post.reply.root.cid)) {
        posts.push(mapPostWithAuthor(post.reply.parent, undefined, true));
      }
      posts.push(mapPostWithAuthor(post.post));
      return [...acc, ...posts];
    }
  
    return [...acc, mapPostWithAuthor(post.post, post.reason)];
  }, []);
}

export function mapThreads(thread: ThreadNode): ThreadResponseSchema {
  if (thread.type === 'post') {
    const { post, replies } = thread;
    return {
      parent: thread.parent ? mapThreads(thread.parent) : undefined,
      post: mapPostWithAuthor(post),
      replies: replies?.filter(thread => thread.type === 'post')
        .map(thread => mapThreads(thread)) ?? []
    }
  } else {
    return {
      parent: undefined,
      post: undefined,
      replies: []
    };
  }
}
