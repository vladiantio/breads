// source: https://github.com/bluesky-social/social-app/blob/main/src/types/bsky/index.ts

/**
 * Fast type checking without full schema validation, for use with data we
 * trust, or for non-critical path use cases. Why? Our SDK's `is*` identity
 * utils do not assert the type of the entire object, only the `$type` string.
 *
 * For full validation of the object schema, use the `validate` export from
 * this file.
 *
 * Usage:
 * ```ts
 * import * as bsky from '#/types/bsky'
 *
 * if (bsky.dangerousIsType<AppBskyFeedPost.Record>(item, AppBskyFeedPost.isRecord)) {
 *   // `item` has type `$Typed<AppBskyFeedPost.Record>` here
 * }
 * ```
 */
export function dangerousIsType<R extends {$type?: string}>(
  record: unknown,
  identity: <V>(v: V) => v is V & {$type: NonNullable<R['$type']>},
): record is R {
  return identity(record)
}
