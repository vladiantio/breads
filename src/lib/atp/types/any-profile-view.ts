// source: https://github.com/bluesky-social/social-app/blob/main/src/types/bsky/profile.ts

import { type AppBskyActorDefs, type ChatBskyActorDefs } from '@atcute/bluesky'

/**
 * Matches any profile view exported by our SDK
 */
export type AnyProfileView =
  | AppBskyActorDefs.ProfileViewBasic
  | AppBskyActorDefs.ProfileView
  | AppBskyActorDefs.ProfileViewDetailed
  | ChatBskyActorDefs.ProfileViewBasic
