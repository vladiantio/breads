import { AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedVideo, ComAtprotoRepoStrongRef, Facet } from "@atproto/api";

export interface ResponseSchema {
  posts: PostWithAuthor[];
  cursor?: string;
}

export interface Post {
  id: string;
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
}

export interface PostWithAuthor extends Post {
  author: Partial<User>;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  following: number;
  followers: number;
  isFollowing?: boolean;
  pinnedPost?: ComAtprotoRepoStrongRef.Main;
}
