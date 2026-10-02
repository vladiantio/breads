import { useState } from "react"
import { DownloadIcon } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import type { Cid, Did } from "@atcute/lexicons"
import { Button } from "@/ui/button"
import { Spinner } from "@/ui/spinner"
import { downloadBlob, parseMediaBlobRef } from "@/lib/atp/download-blob"

interface DownloadBlobButtonProps {
  /** CDN URL of the media, used to locate the blob's DID + CID */
  url?: string
  /** blob CID when already known (e.g. video view) — overrides the CID parsed from the URL */
  cid?: string
  /** author DID when already known — overrides the DID parsed from the URL */
  did?: string
  className?: string
}

export function DownloadBlobButton({ url, cid, did, className }: DownloadBlobButtonProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const parsed = parseMediaBlobRef(url)
  const resolvedDid = did ?? parsed?.did
  const resolvedCid = (cid as Cid | undefined) ?? parsed?.cid
  const ref = resolvedDid && resolvedCid ? { did: resolvedDid as Did, cid: resolvedCid } : null

  if (!ref) return null

  const onClick = async () => {
    setLoading(true)
    try {
      await downloadBlob(ref.did, ref.cid)
    } catch (error) {
      console.error("Failed to download blob:", error)
      toast.error(t("post.embed.downloadFailed"))
    }
    setLoading(false)
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={className}
      title={loading ? t("post.embed.downloading") : t("post.embed.download")}
      disabled={loading}
      onClick={(event) => {
        event.stopPropagation()
        void onClick()
      }}
    >
      {loading ? <Spinner /> : <DownloadIcon />}
    </Button>
  )
}
