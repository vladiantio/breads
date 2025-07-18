// source: https://github.com/bluesky-social/social-app/blob/main/bskyembed/src/labels.ts
import {AppBskyFeedDefs} from '@atproto/api'
import { t } from "@lingui/core/macro";

export const CONTENT_LABELS = ['porn', 'sexual', 'nudity', 'graphic-media']

export function labelsToInfo(
  labels?: AppBskyFeedDefs.PostView['labels'],
): string | undefined {
  const label = labels?.find(label => CONTENT_LABELS.includes(label.val))

  switch (label?.val) {
    case 'porn':
    case 'sexual':
      return t`Adult Content`
    case 'nudity':
      return t`Non-sexual Nudity`
    case 'gore':
    case 'graphic-media':
      return t`Graphic Media`
    default:
      return undefined
  }
}
