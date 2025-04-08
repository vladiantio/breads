import { PostWithAuthor, ResponseSchema, ThreadResponseSchema, User } from "@/types/ResponseSchema";
import { $Typed, Agent, AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedVideo, AppBskyFeedDefs, CredentialSession, Facet, RichText } from "@atproto/api";

const API_BASE_URL = "https://api.bsky.app";

const headers = {
  "Accept-Language": "en",
};

export function createAgent(): Agent {
  const session = new CredentialSession(new URL(API_BASE_URL));
  return new Agent(session);
}

function mapPostWithAuthor(post: AppBskyFeedDefs.PostView): PostWithAuthor {
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
  };
}

function mapFeedToPosts(feed: AppBskyFeedDefs.FeedViewPost[]): PostWithAuthor[] {
  return feed.map(({ post }) => mapPostWithAuthor(post));
}

function mapThreads(thread:
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

export async function getFeed(agent: Agent, feedUrl: string, limit: number = 30, cursor?: string): Promise<ResponseSchema> {
  const { data } = await agent.app.bsky.feed.getFeed(
    { feed: feedUrl, limit, cursor },
    { headers },
  );
  const posts = mapFeedToPosts(data.feed);
  return { posts, cursor: data.cursor };
}

export async function getProfile(agent: Agent, handle: string) {
  const { data: { did } } = await agent.com.atproto.identity.resolveHandle({ handle });
  return getActorProfile(agent, did);
}

export async function getActorProfile(agent: Agent, actor: string): Promise<User> {
  const { data: {
    did,
    handle,
    avatar,
    banner,
    description,
    displayName,
    followersCount,
    followsCount,
    pinnedPost,
  } } = await agent.app.bsky.actor.getProfile(
    { actor },
    { headers },
  );
  return {
    id: did,
    username: handle,
    avatar,
    banner,
    bio: description ?? '',
    displayName: displayName!,
    followers: followersCount ?? 0,
    following: followsCount ?? 0,
    pinnedPost,
  };
}

export async function getAuthorFeed(
  agent: Agent,
  did: string,
  cursor?: string,
  filter: "posts_and_author_threads" | "posts_with_replies" | "posts_no_replies" | "posts_with_media" | "posts_with_video" | (string & {}) = 'posts_and_author_threads',
  includePins: boolean = true,
  limit: number = 30
): Promise<ResponseSchema> {
  const { data } = await agent.app.bsky.feed.getAuthorFeed(
    {
      actor: did,
      cursor,
      filter,
      includePins,
      limit,
    },
    { headers },
  );
  const posts = mapFeedToPosts(data.feed);
  return { posts, cursor: data.cursor };
}

export async function getPostThreads(
  agent: Agent,
  uri: string,
  depth: number = 10,
): Promise<ThreadResponseSchema> {
  const { data: { thread } } = await agent.app.bsky.feed.getPostThread({
    uri,
    depth,
  });

  return mapThreads(thread);
} 

export const convertRichTextToPlainText = (text: string, facets?: Facet[]): string => {
  try {
    const richText = new RichText({ text, facets });
    return [...richText.segments()].map(segment => {
      if (segment.isLink())
        return segment.link!.uri;
      else
        return segment.text;
    }).join('');
  } catch (error) {
    console.error('Error converting rich text to plain text:', error);
    return text;
  }
};
