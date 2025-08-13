import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { useRouter } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { hackModifyThumbnailPath } from "@/lib/atp/utils"

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
  "2xl": "size-20",
}

interface UserAvatarProps extends React.ComponentProps<"span"> {
  username?: string
  displayName?: string
  src?: string
  size?: keyof typeof sizeClasses
  clickable?: boolean
  blurred?: boolean
}

export function UserAvatar({
  username,
  displayName,
  src,
  size = "md",
  clickable = false,
  blurred = false,
  className,
  ...props
}: UserAvatarProps) {
  const { navigate } = useRouter()

  const name = displayName || username

  const handleClick = (e: React.MouseEvent) => {
    if (clickable && username) {
      e.stopPropagation()
      navigate({
        to: "/profile/$username",
        params: { username }
      })
    }
  }

  return (
    <Avatar
      className={cn("border", sizeClasses[size], className)}
      role={clickable ? "button" : undefined}
      onClick={handleClick}
      {...props}
    >
      <AvatarImage
        src={hackModifyThumbnailPath(src, true)}
        alt={name}
        loading="lazy"
        className={cn("object-cover", blurred && "blur-sm")}
      />
      <AvatarFallback>
        {name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
