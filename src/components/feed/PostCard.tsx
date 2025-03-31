import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Repeat,
  MoreHorizontal,
  Copy,
  XCircle,
  Flag,
  Share2,
  Repeat1,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import UserAvatar from '../shared/UserAvatar';
import { ThreadContentRenderer } from '../shared/ThreadContentRenderer';
import { formatTimestamp } from '@/utils/date';
import { formatNumber } from '@/utils/number';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { toast } from "sonner";
import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { PostWithAuthor } from '@/types/ResponseSchema';
import { RichTextRenderer } from '../shared/RichTextRenderer';
import { convertRichTextToPlainText } from '@/lib/atproto-helpers';

interface PostCardProps {
  post: PostWithAuthor;
  isDetail?: boolean;
  fromATP?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false, fromATP = false }) => {
  // const navigate = useNavigate();
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp();
  
  // const isLiked = postLikeStatus[post.id];
  // const isReposted = postRepostStatus[post.id];
  const [ isLiked, setIsLiked ] = useState(false);
  const [ isReposted, setIsReposted ] = useState(false);
  const [ showImages, setShowImages ] = useState(false);

  const handlePostClick = () => {
    if (!isDetail) {
      // navigate(`/post/${post.id}`);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(status => !status);
    // toggleLike(post.id);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReposted(status => !status);
    // toggleRepost(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate share action
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast("Share options", {
      description: "Copy link, share to other platforms...",
      duration: 2000,
    });
  };

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = fromATP
      ? convertRichTextToPlainText(post.content, post.facets)
      : post.content;
    navigator.clipboard.writeText(text);
    toast("Text copied", {
      description: "Post text copied to clipboard",
      duration: 2000,
    });
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast("Report submitted", {
      description: "Thank you for helping keep our community safe",
      duration: 2000,
    });
  };

  const handleNotInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast("Preference saved", {
      description: "You'll see less content like this",
      duration: 2000,
    });
  };

  return (
    <article
      className={`not-first:border-t ${isDetail ? 'mb-0' : ''}`}
      onClick={handlePostClick}
    >
      <div className="flex items-start p-3 space-x-3">
        <UserAvatar user={post.author} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-x-2 mb-1">
            <div className="flex items-center gap-x-2 overflow-hidden text-muted-foreground">
              <Link
                to="/profile/$username"
                params={{
                  username: post.author.username!,
                }}
                className="space-x-2 truncate"
              >
                <span className="font-semibold text-foreground hover:underline active:opacity-60">{post.author.displayName}</span>
                <span>@{post.author.username}</span>
              </Link>
              <span>·</span>
              <span>{formatTimestamp(post.timestamp)}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer">
                  <Copy className="mr-2" size={16} />
                  <span>Copy text</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer">
                  <XCircle className="mr-2" size={16} />
                  <span>Not interested in this post</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport} className="cursor-pointer" variant="destructive">
                  <Flag className="mr-2" size={16} />
                  <span>Report post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {post.content
            ? fromATP
              ? <RichTextRenderer className="my-1" text={post.content} facets={post.facets} />
              : <ThreadContentRenderer className="my-1" content={post.content} />
            : null}

          {post.embedImages && post.embedImages.length > 0
            && (
            <Button size="sm" variant="outline" onClick={() => setShowImages(show => !show)}>
              { showImages ? <EyeOffIcon /> : <EyeIcon /> }
              { showImages ? 'Hide' : 'Show' } images
            </Button>
          )}

          {post.images && post.images.length > 0 && (
            <div className="mt-3 rounded-2xl overflow-hidden border">
              <img 
                src={post.images[0]} 
                alt="Post content" 
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}

          {showImages && post.embedImages && post.embedImages.length > 0 && (
            <div className="mt-3 flex gap-x-2">
              {post.embedImages.map(image => (
                <div>
                  <img 
                    src={image.thumb} 
                    alt={image.alt}
                    className="w-full rounded-2xl border"
                    loading="lazy"
                    style={{aspectRatio: image.aspectRatio ? `${image.aspectRatio.width} / ${image.aspectRatio.height}` : undefined}}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-x-1 mt-2 -mx-3">
            <Button
              aria-label="Reply"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                // navigate(`/post/${post.id}`);
              }}
              className="rounded-full text-muted-foreground"
            >
              <MessageCircle className='size-5' />
              {post.replies > 0 && (
                <span>{formatNumber(post.replies)}</span>
              )}
            </Button>

            <Button
              aria-label="Repost"
              variant="ghost"
              className={cn('rounded-full text-muted-foreground', isReposted && '!text-green-500')}
              onClick={handleRepost}
            >
              {isReposted
                ? <Repeat1 className='size-5' />
                : <Repeat className='size-5' />}
              {post.reposts + (isReposted ? 1 : 0) > 0 && (
                <span>{formatNumber(post.reposts + (isReposted ? 1 : 0))}</span>
              )}
            </Button>

            <Button
              aria-label="Like"
              variant="ghost"
              className={cn('rounded-full text-muted-foreground', isLiked && '!text-red-500')}
              onClick={handleLike}
            >
              <Heart
                className={cn('size-5', isLiked && 'fill-current')}
              />
              {post.likes + (isLiked ? 1 : 0) > 0 && (
                <span>{formatNumber(post.likes + (isLiked ? 1 : 0))}</span>
              )}
            </Button>

            <Button
              aria-label="Share"
              variant="ghost"
              className="rounded-full text-muted-foreground"
              onClick={handleShare}
            >
              <Share2 className='size-5' />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
