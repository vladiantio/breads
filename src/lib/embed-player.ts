// source: https://github.com/bluesky-social/social-app/blob/main/src/lib/strings/embed-player.ts

import { isSafari } from "./browser";

export function parseTenorGif(urlp: URL):
  | {success: false}
  | {
      success: true
      playerUri: string
      dimensions: {height: number; width: number}
    } {
  if (urlp.hostname !== 'media.tenor.com') {
    return {success: false}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
  let [_, id, filename] = urlp.pathname.split('/')

  if (!id || !filename) {
    return {success: false}
  }

  if (!id.includes('AAAAC')) {
    return {success: false}
  }

  const h = urlp.searchParams.get('hh')
  const w = urlp.searchParams.get('ww')

  if (!h || !w) {
    return {success: false}
  }

  const dimensions = {
    height: Number(h),
    width: Number(w),
  }

  if (isSafari) {
    id = id.replace('AAAAC', 'AAAP1')
    filename = filename.replace('.gif', '.mp4')
  } else {
    id = id.replace('AAAAC', 'AAAP3')
    filename = filename.replace('.gif', '.webm')
  }

  return {
    success: true,
    playerUri: `https://t.gifs.bsky.app/${id}/${filename}`,
    dimensions,
  }
}

export function isTenorGifUri(url: URL | string) {
  try {
    return parseTenorGif(typeof url === 'string' ? new URL(url) : url).success
  } catch {
    // Invalid URL
    return false
  }
}