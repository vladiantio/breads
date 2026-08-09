// source: https://github.com/bluesky-social/social-app/blob/main/bskyembed/src/labels.ts
import {AppBskyFeedDefs} from '@atcute/bluesky'
import { t } from '@/i18n/i18n'

export const CONTENT_LABELS = ['porn', 'sexual', 'nudity', 'graphic-media']

export function labelsToInfo(
  labels?: AppBskyFeedDefs.PostView['labels'],
): string | undefined {
  const label = labels?.find(label => CONTENT_LABELS.includes(label.val))

  switch (label?.val) {
    case 'porn':
    case 'sexual':
      return t('labels.adultContent')
    case 'nudity':
      return t('labels.nudity')
    case 'gore':
    case 'graphic-media':
      return t('labels.graphicMedia')
    default:
      return undefined
  }
}
