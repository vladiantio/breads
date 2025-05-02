// source: https://github.com/bluesky-social/social-app/blob/main/src/state/queries/post-thread.ts

import { dangerousIsType } from '@/utils/validation';
import { AppBskyFeedDefs, AppBskyFeedGetPostThread, AppBskyFeedPost } from '@atproto/api';
import { REPLY_TREE_DEPTH } from '../constants/threads';

type ThreadViewNode = AppBskyFeedGetPostThread.OutputSchema['thread']

export interface ThreadCtx {
  depth: number
  isHighlightedPost?: boolean
  hasMore?: boolean
  isParentLoading?: boolean
  isChildLoading?: boolean
  isSelfThread?: boolean
  hasMoreSelfThread?: boolean
}

export type ThreadPost = {
  type: 'post'
  _reactKey: string
  uri: string
  post: AppBskyFeedDefs.PostView
  record: AppBskyFeedPost.Record
  parent: ThreadNode | undefined
  replies: ThreadNode[] | undefined
  hasOPLike: boolean | undefined
  ctx: ThreadCtx
}

export type ThreadNotFound = {
  type: 'not-found'
  _reactKey: string
  uri: string
  ctx: ThreadCtx
}

export type ThreadBlocked = {
  type: 'blocked'
  _reactKey: string
  uri: string
  ctx: ThreadCtx
}

export type ThreadUnknown = {
  type: 'unknown'
  uri: string
}

export type ThreadNode =
  | ThreadPost
  | ThreadNotFound
  | ThreadBlocked
  | ThreadUnknown

export function responseToThreadNodes(
  node: ThreadViewNode,
  depth = 0,
  direction: 'up' | 'down' | 'start' = 'start',
): ThreadNode {
  if (
    AppBskyFeedDefs.isThreadViewPost(node) &&
    dangerousIsType<AppBskyFeedPost.Record>(
      node.post.record,
      AppBskyFeedPost.isRecord,
    )
  ) {
    const post = node.post
    // These should normally be present. They're missing only for
    // posts that were *just* created. Ideally, the backend would
    // know to return zeros. Fill them in manually to compensate.
    post.replyCount ??= 0
    post.likeCount ??= 0
    post.repostCount ??= 0
    return {
      type: 'post',
      _reactKey: node.post.uri,
      uri: node.post.uri,
      post: post,
      record: node.post.record,
      parent:
        node.parent && direction !== 'down'
          ? responseToThreadNodes(node.parent, depth - 1, 'up')
          : undefined,
      replies:
        node.replies?.length && direction !== 'up'
          ? node.replies
              .map(reply => responseToThreadNodes(reply, depth + 1, 'down'))
              // do not show blocked posts in replies
              .filter(node => node.type !== 'blocked')
          : undefined,
      hasOPLike: Boolean(node?.threadContext?.rootAuthorLike),
      ctx: {
        depth,
        isHighlightedPost: depth === 0,
        hasMore:
          direction === 'down' && !node.replies?.length && !!post.replyCount,
        isSelfThread: false, // populated `annotateSelfThread`
        hasMoreSelfThread: false, // populated in `annotateSelfThread`
      },
    }
  } else if (AppBskyFeedDefs.isBlockedPost(node)) {
    return {type: 'blocked', _reactKey: node.uri, uri: node.uri, ctx: {depth}}
  } else if (AppBskyFeedDefs.isNotFoundPost(node)) {
    return {type: 'not-found', _reactKey: node.uri, uri: node.uri, ctx: {depth}}
  } else {
    return {type: 'unknown', uri: ''}
  }
}

export function annotateSelfThread(thread: ThreadNode) {
  if (thread.type !== 'post') {
    return
  }
  const selfThreadNodes: ThreadPost[] = [thread]

  let parent: ThreadNode | undefined = thread.parent
  while (parent) {
    if (
      parent.type !== 'post' ||
      parent.post.author.did !== thread.post.author.did
    ) {
      // not a self-thread
      return
    }
    selfThreadNodes.unshift(parent)
    parent = parent.parent
  }

  let node = thread
  for (let i = 0; i < 10; i++) {
    const reply = node.replies?.find(
      r => r.type === 'post' && r.post.author.did === thread.post.author.did,
    )
    if (reply?.type !== 'post') {
      break
    }
    selfThreadNodes.push(reply)
    node = reply
  }

  if (selfThreadNodes.length > 1) {
    for (const selfThreadNode of selfThreadNodes) {
      selfThreadNode.ctx.isSelfThread = true
    }
    const last = selfThreadNodes[selfThreadNodes.length - 1]
    if (
      last &&
      last.ctx.depth === REPLY_TREE_DEPTH && // at the edge of the tree depth
      last.post.replyCount && // has replies
      !last.replies?.length // replies were not hydrated
    ) {
      last.ctx.hasMoreSelfThread = true
    }
  }
}

export function sortThread(
  node: ThreadNode,
  currentDid: string | undefined,
): ThreadNode {
  if (node.type !== 'post') {
    return node
  }
  if (node.replies) {
    node.replies.sort((a: ThreadNode, b: ThreadNode) => {
      if (a.type !== 'post') {
        return 1
      }
      if (b.type !== 'post') {
        return -1
      }

      if (node.ctx.isHighlightedPost) {
        const aIsJustPosted =
          a.post.author.did === currentDid
        const bIsJustPosted =
          b.post.author.did === currentDid
        if (aIsJustPosted && bIsJustPosted) {
          return a.post.indexedAt.localeCompare(b.post.indexedAt) // oldest
        } else if (aIsJustPosted) {
          return -1 // reply while onscreen
        } else if (bIsJustPosted) {
          return 1 // reply while onscreen
        }
      }

      const aIsByOp = a.post.author.did === node.post?.author.did
      const bIsByOp = b.post.author.did === node.post?.author.did
      if (aIsByOp && bIsByOp) {
        return a.post.indexedAt.localeCompare(b.post.indexedAt) // oldest
      } else if (aIsByOp) {
        return -1 // op's own reply
      } else if (bIsByOp) {
        return 1 // op's own reply
      }

      const aIsBySelf = a.post.author.did === currentDid
      const bIsBySelf = b.post.author.did === currentDid
      if (aIsBySelf && bIsBySelf) {
        return a.post.indexedAt.localeCompare(b.post.indexedAt) // oldest
      } else if (aIsBySelf) {
        return -1 // current account's reply
      } else if (bIsBySelf) {
        return 1 // current account's reply
      }

      const aPin = Boolean(a.record.text.trim() === '📌')
      const bPin = Boolean(b.record.text.trim() === '📌')
      if (aPin !== bPin) {
        if (aPin) {
          return 1
        }
        if (bPin) {
          return -1
        }
      }

      return b.post.indexedAt.localeCompare(a.post.indexedAt)
    })
    node.replies.forEach(reply =>
      sortThread(
        reply,
        currentDid,
      ),
    )
  }
  return node
}
