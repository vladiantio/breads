import {
  $Typed,
  AppBskyActorDefs,
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  ComAtprotoRepoStrongRef,
  Facet,  
} from "@atproto/api";

export interface ResponseSchema {
  posts: PostWithAuthor[];
  cursor?: string;
}

export interface ThreadResponseSchema {
  parent?: ThreadResponseSchema;
  post?: PostWithAuthor;
  replies: ThreadResponseSchema[];
}

export type Reason = $Typed<AppBskyFeedDefs.ReasonRepost> | $Typed<AppBskyFeedDefs.ReasonPin> | { $type: string }

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
  facets?: Facet[];
  embedImages?: AppBskyEmbedImages.ViewImage[];
  embedVideo?: AppBskyEmbedVideo.View;
  embedExternal?: AppBskyEmbedExternal.ViewExternal;
  embedPost?: PostWithAuthor;
  reason?: Reason;
  isThreadParent?: boolean;
  labelInfo?: string;
  viewer?: AppBskyFeedDefs.ViewerState;
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
