import { PostWithAuthor, ResponseSchema } from "@/types/ResponseSchema";
import { $Typed, Agent, AppBskyEmbedExternal, AppBskyEmbedImages, CredentialSession, Facet, RichText } from "@atproto/api";

const API_BASE_URL = "https://api.bsky.app";

export function createAgent(): Agent {
  const session = new CredentialSession(new URL(API_BASE_URL));
  return new Agent(session);
}

export async function getFeed(agent: Agent, feedUrl: string, limit: number = 30, cursor?: string) {
  const { data } = await agent.app.bsky.feed.getFeed(
    { feed: feedUrl, limit, cursor },
    {
      headers: {
        "Accept-Language": "en",
      },
    },
  );
  const posts: PostWithAuthor[] = data.feed.map(({ post }) => ({
    id: post.cid,
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
    embedExternal: post.embed?.$type === 'app.bsky.embed.external#view' ? (post.embed as $Typed<AppBskyEmbedExternal.View>).external : undefined,
  }));
  const res: ResponseSchema = { posts, nextPage: cursor };
  return res;
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
