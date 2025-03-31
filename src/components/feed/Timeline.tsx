import CreatePost from "./CreatePost";
import FeedTabs from "./FeedTabs";
import PostCard from "./PostCard";
import { useQuery } from "@tanstack/react-query";
import { createAgent, getFeed } from "@/lib/atproto-helpers";

export function Timeline() {
  const { isPending, error, data } = useQuery({
    queryKey: ['feedData'],
    queryFn: () => {
      const agent = createAgent();
      return getFeed(agent, 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot');
    },
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <FeedTabs />
      <CreatePost />
      {data.posts.map(post => (
        <PostCard post={post} fromATP />
      ))}
    </>
  )
}