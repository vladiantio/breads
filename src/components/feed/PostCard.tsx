import { useMemo, useState } from 'react';
import { PinIcon, RepeatIcon } from 'lucide-react';
import { UserAvatar } from '../shared/UserAvatar';
import { toast } from "sonner";
import { PostWithAuthor } from '@/types/ResponseSchema';
import { convertRichTextToPlainText } from '@/lib/atp/utils';
import { PostCardActions } from './PostCardActions';
import { PostCardContent } from './PostCardContent';
import { PostCardHeader } from './PostCardHeader';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { isInvalidHandle } from '@/lib/atp/strings/handles';
import { AppBskyFeedDefs } from '@atproto/api';

interface PostCardProps {
  post: PostWithAuthor;
  isDetail?: boolean;
  isEmbed?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isDetail = false,
  isEmbed = false,
}) => {
  const navigate = useNavigate();
  // const { toggleLike, toggleRepost, postLikeStatus, postRepostStatus } = useApp();
  
  // const isLiked = postLikeStatus[post.id];
  // const isReposted = postRepostStatus[post.id];
  const [ isLiked, setIsLiked ] = useState(false);
  const [ isReposted, setIsReposted ] = useState(false);
  const validHandle = useMemo(() => isInvalidHandle(post.author.username) ? post.author.id : post.author.username, [post.author])

  const handlePostClick = (e: React.MouseEvent) => {
    if (isEmbed)
      e.stopPropagation();

    if (!isDetail)
      navigate({
        to: '/profile/$username/post/$postId',
        params: {
          username: validHandle,
          postId: post.uri.split('app.bsky.feed.post/')[1],
        },
      });
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

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const postId = post.uri.split('app.bsky.feed.post/')[1];
    const url = `https://bsky.app/profile/${validHandle}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast("Link copied", {
      description: "Post link copied to clipboard",
      duration: 2000,
    });
  };

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = convertRichTextToPlainText(post.content, post.facets);
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
      className={cn(
        "transition-[background-color] rounded-lg",
        !isDetail && "cursor-pointer hover:bg-card active:bg-card/60"
      )}
      onClick={handlePostClick}
    >
      {AppBskyFeedDefs.isReasonPin(post.reason)
      ? (
        <div className="flex items-center gap-x-4 text-sm text-muted-foreground pt-4 px-4 -mb-2">
          <PinIcon className="size-4 ml-6" />
          Pinned
        </div>
      )
      : null }

      {AppBskyFeedDefs.isReasonRepost(post.reason)
      ? (
        <div className="flex items-center gap-x-4 text-sm text-muted-foreground pt-4 px-4 -mb-2">
          <RepeatIcon className="size-4 ml-6" />
          Reposted by {post.reason.by.displayName}
        </div>
      )
      : null }

      {isDetail || isEmbed ? (
        <div className="p-4">
          <div className="flex items-center gap-x-4">
            <UserAvatar
              username={validHandle}
              displayName={post.author.displayName}
              src={post.author.avatar}
              clickable
            />

            <div className="flex-1 min-w-0">
              <PostCardHeader
                author={post.author}
                timestamp={post.timestamp}
                onCopyLink={handleCopyLink}
                onCopyText={handleCopyText}
                onNotInterested={handleNotInterested}
                onReport={handleReport}
              />
            </div>
          </div>

          <PostCardContent
            content={post.content}
            facets={post.facets}
            embedImages={post.embedImages}
            embedVideo={post.embedVideo}
            embedExternal={post.embedExternal}
            embedPost={post.embedPost}
            isDetail={isDetail || isEmbed}
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
        <div className="flex p-4 gap-x-4">
          <div className="flex flex-col items-center relative">
            {post.isThreadParent ? (
              <div className="w-0.5 bg-border rounded-full absolute top-12 -bottom-8" />
            ) : null}
            <div className="h-12 content-center">
              <UserAvatar
                username={validHandle}
                displayName={post.author.displayName}
                src={post.author.avatar}
                clickable
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <PostCardHeader
              author={post.author}
              timestamp={post.timestamp}
              onCopyLink={handleCopyLink}
              onCopyText={handleCopyText}
              onNotInterested={handleNotInterested}
              onReport={handleReport}
            />

            <PostCardContent
              content={post.content}
              facets={post.facets}
              embedImages={post.embedImages}
              embedVideo={post.embedVideo}
              embedExternal={post.embedExternal}
              embedPost={post.embedPost}
              isDetail={isDetail}
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

export { PostCard };
