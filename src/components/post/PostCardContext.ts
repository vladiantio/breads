import { PostWithAuthor } from "@/types/ResponseSchema"
import { createContext, useContext } from "react"

export type PostCardContextProps = {
  post: PostWithAuthor
  isSameAuthorFeed: boolean
  isLiked: boolean
  isReposted: boolean
  onLike: (e: React.MouseEvent) => void
  onRepost: (e: React.MouseEvent) => void
  onShare: (e: React.MouseEvent) => void
  onReply: (e: React.MouseEvent) => void
  onCopyLink: (e: React.MouseEvent) => void
  onCopyText: (e: React.MouseEvent) => void
  onNotInterested: (e: React.MouseEvent) => void
  onReport: (e: React.MouseEvent) => void
  isDetail?: boolean
  isEmbed?: boolean
}

const PostCardContext = createContext<PostCardContextProps | null>(null)

export function usePostCard() {
  const context = useContext(PostCardContext)
  if (!context) {
    throw new Error("usePostCard must be used within a PostCardProvider.")
  }

  return context
}

export const PostCardProvider = PostCardContext.Provider
