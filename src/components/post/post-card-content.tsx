import { cn } from "@/lib/utils"
import { RichTextRenderer } from "../shared/rich-text-renderer"
import { EmbedExternal } from "./embed-external"
import { EmbedImages } from "./embed-images"
import { EmbedVideo } from "./embed-video"
import { EmbedPost } from "./embed-post"
import { Alert, AlertTitle } from "@/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { usePostCard } from "./post-card-context"
import { PostCardContentTranslate } from "./post-card-content-translate"

export function PostCardContent() {
  const {
    post: {
      content,
      facets,
      embedImages,
      embedVideo,
      embedExternal,
      embedPost,
      labelInfo,
    },
    isDetail,
    isEmbed,
  } = usePostCard()

  return (
    <div className={cn("space-y-4", (isDetail || isEmbed) ? "mt-4" : "mt-1")}>
      {content && content.trim().length > 0
        ? <RichTextRenderer text={content} facets={facets} />
        : null}

      <PostCardContentTranslate />

      {labelInfo && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>{labelInfo}</AlertTitle>
        </Alert>
      )}

      {!labelInfo && embedImages && embedImages.length > 0 && (
        <EmbedImages
          views={embedImages}
          isDetail={isDetail || isEmbed}
        />
      )}

      {!labelInfo && embedVideo && (
        <EmbedVideo view={embedVideo} />
      )}

      {embedExternal && (
        <EmbedExternal view={embedExternal} />
      )}

      {embedPost && (
        <EmbedPost post={embedPost} />
      )}
    </div>
  )
}
