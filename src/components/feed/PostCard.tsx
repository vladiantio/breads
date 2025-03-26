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
  Repeat1
} from 'lucide-react';
import { PostWithAuthor } from '@/data/posts';
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
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostWithAuthor;
  isDetail?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const navigate = useNavigate();
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp();
  
  // const isLiked = postLikeStatus[post.id];
  // const isReposted = postRepostStatus[post.id];
  const [ isLiked, setIsLiked ] = useState(false);
  const [ isReposted, setIsReposted ] = useState(false);

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
    navigator.clipboard.writeText(post.content);
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
      <div className="p-3">
        <div className="flex items-start space-x-3">
          <UserAvatar user={post.author} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className="font-semibold truncate hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      to: '/profile/$username',
                      params: {
                        username: post.author.username,
                      },
                    });
                  }}
                >
                  {post.author.displayName}
                </span>
                <span className="text-muted-foreground">@{post.author.username}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
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

            <div className="mt-1">
              <ThreadContentRenderer content={post.content} />
            </div>

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
      </div>
    </article>
  );
};

export default PostCard;
