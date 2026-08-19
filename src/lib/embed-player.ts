// source: https://github.com/bluesky-social/social-app/blob/main/src/lib/strings/embed-player.ts

export type GifParsed = {
  playerUri: string
  playerSources?: ReadonlyArray<{src: string; type: string}>
  dimensions: {height: number; width: number}
}

export function parseTenorGif(urlp: URL): GifParsed | null {
  if (urlp.hostname !== 'media.tenor.com') {
    return null
  }

  const [__, id, filename] = urlp.pathname.split('/')

  if (!id || !filename) {
    return null
  }

  if (!id.includes('AAAAC')) {
    return null
  }

  const h = urlp.searchParams.get('hh')
  const w = urlp.searchParams.get('ww')

  if (!h || !w) {
    return null
  }

  const dimensions = {
    height: Number(h),
    width: Number(w),
  }

  // Validate dimensions are valid positive numbers
  if (
    isNaN(dimensions.height) ||
    isNaN(dimensions.width) ||
    dimensions.height <= 0 ||
    dimensions.width <= 0
  ) {
    return null
  }

  // Tenor encodes the format in the ID prefix: AAAP3 = webm, AAAP1 = mp4.
  // Provide both as <source> tags so the browser picks via canPlayType
  // instead of relying on user-agent sniffing.
  const webmUrl = `https://t.gifs.bsky.app/${id.replace('AAAAC', 'AAAP3')}/${filename.replace('.gif', '.webm')}`
  const mp4Url = `https://t.gifs.bsky.app/${id.replace('AAAAC', 'AAAP1')}/${filename.replace('.gif', '.mp4')}`
  return {
    playerUri: mp4Url,
    playerSources: [
      {src: webmUrl, type: 'video/webm'},
      {src: mp4Url, type: 'video/mp4'},
    ],
    dimensions,
  }
}

export function parseKlipyGif(urlp: URL): GifParsed | null {
  if (urlp.hostname !== 'static.klipy.com') {
    return null
  }

  if (!urlp.pathname.startsWith('/ii/')) {
    return null
  }

  const h = urlp.searchParams.get('hh')
  const w = urlp.searchParams.get('ww')

  if (!h || !w) {
    return null
  }

  const dimensions = {
    height: Number(h),
    width: Number(w),
  }

  // Validate dimensions are valid positive numbers
  if (
    isNaN(dimensions.height) ||
    isNaN(dimensions.width) ||
    dimensions.height <= 0 ||
    dimensions.width <= 0
  ) {
    return null
  }

  const webmSlug = urlp.searchParams.get('webm')
  const mp4Slug = urlp.searchParams.get('mp4')

  const playerUrl = new URL(urlp.href)
  playerUrl.hostname = 'k.gifs.bsky.app'

  // Strip all metadata params — only the path matters for the CDN
  playerUrl.searchParams.delete('hh')
  playerUrl.searchParams.delete('ww')
  playerUrl.searchParams.delete('mp4')
  playerUrl.searchParams.delete('webm')

  // Without any slug we can't produce a playable video URL on web,
  // so fall back to the link card instead of returning a broken player.
  if (!webmSlug && !mp4Slug) {
    return null
  }

  const buildVideoUrl = (slug: string, ext: string) => {
    const u = new URL(playerUrl.href)
    const parts = u.pathname.split('/')
    parts[parts.length - 1] = `${slug}.${ext}`
    u.pathname = parts.join('/')
    return u.href
  }

  const sources: {src: string; type: string}[] = []
  if (webmSlug) {
    sources.push({
      src: buildVideoUrl(webmSlug, 'webm'),
      type: 'video/webm',
    })
  }
  if (mp4Slug) {
    sources.push({src: buildVideoUrl(mp4Slug, 'mp4'), type: 'video/mp4'})
  }

  // Prefer mp4 as the fallback `playerUri` for `<video src>` since it has
  // wider codec support across legacy browsers.
  const fallback = mp4Slug
    ? buildVideoUrl(mp4Slug, 'mp4')
    : buildVideoUrl(webmSlug!, 'webm')

  return {
    playerUri: fallback,
    playerSources: sources,
    dimensions,
  }
}

export function parseGif(url: URL | string) {
  const urlp = typeof url === "string" ? new URL(url) : url
  return parseTenorGif(urlp) ?? parseTenorGif(urlp)
}
