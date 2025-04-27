// source: https://github.com/bluesky-social/social-app/blob/main/src/lib/strings/handles.ts
import { forceLTR } from '@/lib/strings/bidi'

export function isInvalidHandle(handle: string): boolean {
  return handle === 'handle.invalid'
}

export function sanitizeHandle(handle: string, prefix = ''): string {
  return isInvalidHandle(handle)
    ? '⚠ Invalid Handle'
    : forceLTR(`${prefix}${handle.toLocaleLowerCase()}`)
}
