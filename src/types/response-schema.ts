import {
  AppBskyActorDefs,
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  AppBskyRichtextFacet,
} from "@atcute/bluesky";
import { ComAtprotoRepoStrongRef } from "@atcute/atproto";

export interface ResponseSchema {
  posts: PostWithAuthor[];
  cursor?: string;
}

export interface ThreadResponseSchema {
  parent?: ThreadResponseSchema;
  post?: PostWithAuthor;
  replies: ThreadResponseSchema[];
}

export type Reason = AppBskyFeedDefs.ReasonRepost | AppBskyFeedDefs.ReasonPin | { $type: string }

export interface Post {
  id: string;
  uri: string;
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  liked?: boolean;
  reposted?: boolean;
  facets?: AppBskyRichtextFacet.Main[];
  embedImages?: AppBskyEmbedImages.ViewImage[];
  embedVideo?: AppBskyEmbedVideo.View;
  embedExternal?: AppBskyEmbedExternal.ViewExternal;
  embedPost?: PostWithAuthor;
  reason?: Reason;
  isThreadParent?: boolean;
  labelInfo?: string;
  viewer?: AppBskyFeedDefs.ViewerState;
  langs?: string[];
}

export interface PostWithAuthor extends Post {
  author: User;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  following?: number;
  followers?: number;
  isFollowing?: boolean;
  pinnedPost?: ComAtprotoRepoStrongRef.Main;
  verification?: AppBskyActorDefs.VerificationState;
}
