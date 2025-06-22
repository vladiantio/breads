// source: https://github.com/bluesky-social/social-app/blob/main/src/lib/strings/handles.ts
import { forceLTR } from '@/lib/strings/bidi'
import { t } from '@lingui/core/macro'

export function isInvalidHandle(handle: string): boolean {
  return handle === 'handle.invalid'
}

export function sanitizeHandle(handle: string, prefix = ''): string {
  return isInvalidHandle(handle)
    ? '⚠ ' + t`Invalid Handle`
    : forceLTR(`${prefix}${handle.toLocaleLowerCase()}`)
}
