import React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat,
  MoreHorizontal,
  Copy,
  XCircle,
  Flag,
  Share2
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
import { toast } from "sonner"

interface PostCardProps {
  post: PostWithAuthor;
  isDetail?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  // const navigate = useNavigate();
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp();
  
  // const isLiked = postLikeStatus[post.id];
  // const isReposted = postRepostStatus[post.id];
  const isLiked = false;
  const isReposted = false;

  const handlePostClick = () => {
    if (!isDetail) {
      // navigate(`/post/${post.id}`);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // toggleLike(post.id);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <UserAvatar user={post.author} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className="font-semibold truncate hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // navigate(`/profile/${post.author.username}`);
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

            <div className="flex items-center gap-x-8 mt-3 pt-2">
              <button
                aria-label="Reply"
                className="flex items-center space-x-1 text-muted-foreground hover:text-sky-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate(`/post/${post.id}`);
                }}
              >
                <MessageCircle size={18} />
                <span>{formatNumber(post.replies)}</span>
              </button>

              <button
                aria-label="Repost"
                className={`flex items-center space-x-1 transition-colors ${
                  isReposted ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'
                }`}
                onClick={handleRepost}
              >
                <Repeat size={18} />
                <span>{formatNumber(post.reposts)}</span>
              </button>

              <button
                aria-label="Like"
                className={`like-button flex items-center space-x-1 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                }`}
                onClick={handleLike}
              >
                <Heart size={18} />
                <span>{formatNumber(post.likes)}</span>
              </button>

              <button
                aria-label="Share"
                className="flex items-center space-x-1 text-muted-foreground hover:text-sky-500 transition-colors"
                onClick={handleShare}
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
