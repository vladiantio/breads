import { Client, ok, simpleFetchHandler } from "@atcute/client"
import type { Cid, Did } from "@atcute/lexicons"
import { identityResolver } from "./store"

/**
 * Extracts the DID + blob CID from a Bluesky CDN media URL:
 * - images: https://cdn.bsky.app/img/{kind}/plain/{did}/{cid}[@{fmt}]
 * - video:  https://video.bsky.app/watch/{did}/{cid}/{...}
 */
export function parseMediaBlobRef(url?: string): { did: Did; cid: Cid } | null {
  if (!url) return null

  const imageMatch = /\/plain\/(did:[^/]+)\/([^/@]+)/.exec(url)
  if (imageMatch) {
    return { did: imageMatch[1] as Did, cid: imageMatch[2] as Cid }
  }

  const videoMatch = /\/watch\/([^/]+)\/([^/]+)\//.exec(url)
  if (videoMatch) {
    return { did: decodeURIComponent(videoMatch[1]) as Did, cid: videoMatch[2] as Cid }
  }

  return null
}

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.style = "display:none;"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/**
 * Fetches a blob straight from the author's PDS via `com.atproto.sync.getBlob`
 * and saves it to disk. (The public AppView endpoint doesn't implement this
 * method, so the PDS has to be resolved from the DID first.)
 */
export async function downloadBlob(did: Did, cid: Cid): Promise<void> {
  const actor = await identityResolver.resolve(did)
  const client = new Client({
    handler: simpleFetchHandler({ service: actor.pds }),
  })

  const blob = await ok(
    client.get("com.atproto.sync.getBlob", {
      params: { did, cid },
      as: "blob",
    }),
  )

  const extension = MIME_EXTENSIONS[blob.type] ?? ""
  triggerDownload(blob, `${cid}${extension}`)
}
