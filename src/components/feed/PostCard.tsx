import { useState } from 'react';
import { PinIcon } from 'lucide-react';
import UserAvatar from '../shared/UserAvatar';
import { toast } from "sonner";
import { PostWithAuthor } from '@/types/ResponseSchema';
import { convertRichTextToPlainText } from '@/lib/atproto-helpers';
import PostCardActions from './PostCardActions';
import PostCardContent from './PostCardContent';
import PostCardHeader from './PostCardHeader';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostWithAuthor;
  isDetail?: boolean;
  fromATP?: boolean;
  isPinned?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isDetail = false,
  fromATP = false,
  isPinned = false,
}) => {
  const navigate = useNavigate();
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp();
  
  // const isLiked = postLikeStatus[post.id];
  // const isReposted = postRepostStatus[post.id];
  const [ isLiked, setIsLiked ] = useState(false);
  const [ isReposted, setIsReposted ] = useState(false);
  const [ showEmbed, setShowEmbed ] = useState(false);

  const handlePostClick = () => {
    if (!isDetail) {
      navigate({
        to: '/profile/$username/post/$postId',
        params: {
          username: post.author.username!,
          postId: post.uri.split('app.bsky.feed.post/')[1],
        },
      });
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

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    // navigate(`/post/${post.id}`);
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

  const handleEmbedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmbed(show => !show);
  };

  return (
    <article
      className={cn(
        "m-1 transition-[background-color] rounded-lg",
        !isDetail && "hover:bg-card active:bg-card/60"
      )}
      onClick={handlePostClick}
    >
      {isPinned && (
        <div className="flex items-center gap-x-3 text-sm text-muted-foreground pt-2 px-2 -mb-1">
          <PinIcon className="size-4 ml-5" />
          Pinned
        </div>
      )}

      {isDetail ? (
        <div className="px-2 pb-3">
          <div className="flex items-center gap-x-3 mb-3">
            <UserAvatar user={post.author} clickable />

            <div className="flex-1 min-w-0">
              <PostCardHeader
                author={post.author}
                timestamp={post.timestamp}
                onCopyText={handleCopyText}
                onNotInterested={handleNotInterested}
                onReport={handleReport}
              />
            </div>
          </div>

          <PostCardContent
            fromATP={fromATP}
            content={post.content}
            facets={post.facets}
            embedImages={post.embedImages}
            embedVideo={post.embedVideo}
            embedExternal={post.embedExternal}
            showEmbed={showEmbed}
            onEmbedToggle={handleEmbedToggle}
          />

          <PostCardActions
            likes={post.likes}
            replies={post.replies}
            reposts={post.reposts}
            isLiked={isLiked}
            isReposted={isReposted}
            onLike={handleLike}
            onRepost={handleRepost}
            onShare={handleShare}
            onReply={handleReply}
          />
        </div>
      ) : (
        <div className="flex px-2 py-3 gap-x-3">
          <UserAvatar user={post.author} clickable />

          <div className="flex-1 min-w-0">
            <PostCardHeader
              author={post.author}
              timestamp={post.timestamp}
              onCopyText={handleCopyText}
              onNotInterested={handleNotInterested}
              onReport={handleReport}
            />

            <PostCardContent
              fromATP={fromATP}
              content={post.content}
              facets={post.facets}
              embedImages={post.embedImages}
              embedVideo={post.embedVideo}
              embedExternal={post.embedExternal}
              showEmbed={showEmbed}
              onEmbedToggle={handleEmbedToggle}
            />

            <PostCardActions
              likes={post.likes}
              replies={post.replies}
              reposts={post.reposts}
              isLiked={isLiked}
              isReposted={isReposted}
              onLike={handleLike}
              onRepost={handleRepost}
              onShare={handleShare}
              onReply={handleReply}
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
