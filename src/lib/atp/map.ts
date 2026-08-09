import { Reason, PostWithAuthor, ThreadResponseSchema, User } from "@/types/response-schema";
import {
  AppBskyEmbedExternal,
  AppBskyEmbedGallery,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  AppBskyFeedPost,
} from "@atcute/bluesky";
import { AnyProfileView } from "./types/any-profile-view";
import { ThreadNode } from "./mapping/threads";
import { labelsToInfo } from "./strings/labels";
import { isType } from "./types/is-type";

export function mapAuthor(author: AnyProfileView): User {
  return {
    id: author.did,
    username: author.handle,
    avatar: author.avatar,
    banner: 'banner' in author ? author.banner : undefined,
    bio: 'description' in author ? author.description : undefined,
    displayName: author.displayName?.replaceAll(/\u2800/g, '') ?? '',
    followers: 'followersCount' in author ? author.followersCount : undefined,
    following: 'followsCount' in author ? author.followsCount : undefined,
    verification: author.verification,
  };
}

export function mapEmbedPostWithAuthor(post: AppBskyEmbedRecord.ViewRecord) {
  const { author } = post;
  const record = post.value as AppBskyFeedPost.Main;
  const embed = post.embeds?.[0];

  const embedMapped = mapEmbedViews(embed);

  const postWithAuthor: PostWithAuthor = {
    id: post.cid,
    uri: post.uri,
    author: mapAuthor(author),
    content: record.text ?? '',
    facets: record.facets,
    timestamp: record.createdAt,
    likes: post.likeCount ?? 0,
    replies: post.replyCount ?? 0,
    reposts: post.repostCount ?? 0,
    labelInfo: labelsToInfo(post.labels),
    langs: record.langs,
    ...embedMapped
  };

  return postWithAuthor;
}

export function mapEmbedViews(embed?:
  | AppBskyEmbedExternal.View
  | AppBskyEmbedGallery.View
  | AppBskyEmbedImages.View
  | AppBskyEmbedRecord.View
  | AppBskyEmbedRecordWithMedia.View
  | AppBskyEmbedVideo.View
  | { $type: string }
) {
  let postWithAuthor: Partial<PostWithAuthor> = {};

  if (embed?.$type === 'app.bsky.embed.images#view')
    postWithAuthor.embedImages = (embed as AppBskyEmbedImages.View).images;

  if (embed?.$type === 'app.bsky.embed.video#view')
    postWithAuthor.embedVideo = embed as AppBskyEmbedVideo.View;

  if (embed?.$type === 'app.bsky.embed.external#view')
    postWithAuthor.embedExternal = (embed as AppBskyEmbedExternal.View).external;

  if (embed?.$type === 'app.bsky.embed.record#view') {
    if ((embed as AppBskyEmbedRecord.View).record.$type === 'app.bsky.embed.record#viewRecord')
      postWithAuthor.embedPost = mapEmbedPostWithAuthor((embed as AppBskyEmbedRecord.View).record as AppBskyEmbedRecord.ViewRecord);
  }

  if (embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
    if ((embed as AppBskyEmbedRecordWithMedia.View).media)
      postWithAuthor = mapEmbedViews((embed as AppBskyEmbedRecordWithMedia.View).media);

    if ((embed as AppBskyEmbedRecordWithMedia.View).record.record.$type === 'app.bsky.embed.record#viewRecord')
      postWithAuthor.embedPost = mapEmbedPostWithAuthor((embed as AppBskyEmbedRecordWithMedia.View).record.record as AppBskyEmbedRecord.ViewRecord);
  }

  return postWithAuthor;
}

export function mapPostWithAuthor(post: AppBskyFeedDefs.PostView, reason?: Reason, isThreadParent?: boolean) {
  const { author, embed } = post;
  const record = post.record as AppBskyFeedPost.Main;

  const embedMapped = mapEmbedViews(embed);

  const postWithAuthor: PostWithAuthor = {
    id: post.cid,
    uri: post.uri,
    author: mapAuthor(author),
    content: record.text ?? '',
    facets: record.facets,
    timestamp: record.createdAt,
    likes: post.likeCount ?? 0,
    replies: post.replyCount ?? 0,
    reposts: post.repostCount ?? 0,
    reason,
    isThreadParent,
    labelInfo: labelsToInfo(post.labels),
    viewer: post.viewer,
    langs: record.langs,
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
      || (isType<AppBskyFeedDefs.PostView>(post.reply?.root, 'app.bsky.feed.defs#postView') && o.id == post.reply?.root.cid)
      || (isType<AppBskyFeedDefs.PostView>(post.reply?.parent, 'app.bsky.feed.defs#postView') && o.id == post.reply?.parent.cid)
    );
  
    if (postExists) {
      return [...acc];
    }
  
    if (!!post.reply && !post.reason) {
      const posts = [];
      if (post.reply.root && isType<AppBskyFeedDefs.PostView>(post.reply.root, 'app.bsky.feed.defs#postView')) {
        posts.push(mapPostWithAuthor(post.reply.root, undefined, true));
      }
      if (post.reply.parent && isType<AppBskyFeedDefs.PostView>(post.reply.parent, 'app.bsky.feed.defs#postView') && (!isType<AppBskyFeedDefs.PostView>(post.reply.root, 'app.bsky.feed.defs#postView') || post.reply.parent.cid !== post.reply.root.cid)) {
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
