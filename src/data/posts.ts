import { users } from './users';

export interface Post {
  id: string;
  content: string;
  images?: string[];
  authorId: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  liked?: boolean;
  reposted?: boolean;
  parentId?: string; // For replies
}

export interface PostWithAuthor extends Post {
  author: typeof users[0];
}

export const posts: Post[] = [
  {
    id: "post1",
    content: `\`\`\`javascript
const message = 'Hello world! 🙋🏻';
console.log(message);
\`\`\``,
    authorId: "user1",
    timestamp: "2025-03-22T14:36:42.022Z",
    likes: 2,
    reposts: 0,
    replies: 0,
  },
  {
    id: "post3",
    content: "The latest developments in **quantum computing** are truly mind-blowing. We're entering a new era of computational power.",
    authorId: "user3",
    timestamp: "2025-03-19T22:12:00Z",
    likes: 2340,
    reposts: 430,
    replies: 87
  },
  {
    id: "post4",
    content: "Just finished the first draft of my new novel. 120,000 words later and I'm both exhausted and excited! #WritingCommunity",
    authorId: "user4",
    timestamp: "2025-03-19T18:37:00Z",
    likes: 1520,
    reposts: 245,
    replies: 198
  },
  {
    id: "post4",
    content: `**ChatGPT** and **DeepSeek** have never been the same:

- **ChatGPT** excels in general versatility, creative content generation, and advanced tools integration.
- **DeepSeek** outperforms in speed, efficiency, structured content creation, real-time analytics, and cost-effectiveness.`,
    authorId: "user3",
    timestamp: "2025-03-19T18:37:00Z",
    likes: 98,
    reposts: 24,
    replies: 10
  },
  // {
  //   id: "post5",
  //   content: "Sunrise over the Himalayas. Moments like these make all the difficult treks worth it.",
  //   authorId: "user5",
  //   timestamp: "2025-03-19T05:16:00Z",
  //   likes: 7830,
  //   reposts: 1240,
  //   replies: 342,
  //   images: ["https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2370&auto=format&fit=crop"]
  // },
  {
    id: "post7",
    content: "Working on a new design system that will revolutionize how we create consistent UIs across platforms. Consistency is key!",
    authorId: "user2",
    timestamp: "2025-03-13T15:20:00Z",
    likes: 754,
    reposts: 102,
    replies: 43
  },
  {
    id: "post8",
    content: "The ethical implications of AI development are something we need to address as an industry. We're organizing a panel discussion next month.",
    authorId: "user3",
    timestamp: "2025-03-13T11:08:00Z",
    likes: 1890,
    reposts: 520,
    replies: 134,
    reposted: true
  },
  {
    id: "post9",
    content: "Finding inspiration in the small moments. Today, it was watching a butterfly land on my coffee cup. Sometimes you just need to slow down.",
    authorId: "user4",
    timestamp: "2025-03-12T16:55:00Z",
    likes: 947,
    reposts: 126,
    replies: 45
  },
  {
    id: "post2",
    content: "Redesigned our app interface with a focus on accessibility. Design should always be inclusive. What do you think of the new look? #Design #Accessibility #UX",
    authorId: "user2",
    timestamp: "2025-03-21T10:45:00Z",
    likes: 892,
    reposts: 124,
    replies: 57,
    images: ["https://images.unsplash.com/photo-1551650992-ee4fd47df41f?q=80&w=2574&auto=format&fit=crop"]
  },
  {
    id: "post10",
    content: `Paragraphs will look much better with this CSS rule:

\`\`\`css
p {
  text-wrap: pretty;
}
\`\`\``,
    authorId: "user1",
    timestamp: "2025-03-23T05:06:20.143Z",
    likes: 0,
    reposts: 0,
    replies: 0,
  },
  {
    id: "reply1",
    content: "This is revolutionary! Can't wait to see how this technology develops further.",
    authorId: "user3",
    timestamp: "2025-03-21T14:45:00Z",
    likes: 234,
    reposts: 12,
    replies: 5,
    parentId: "post1"
  },
  {
    id: "reply2",
    content: "Love the clean and accessible design. Great work!",
    authorId: "user4",
    timestamp: "2025-03-21T11:12:00Z",
    likes: 52,
    reposts: 3,
    replies: 1,
    parentId: "post2"
  },
  {
    id: "reply3",
    content: "Congratulations on finishing your draft! Looking forward to reading it.",
    authorId: "user2",
    timestamp: "2025-03-19T19:05:00Z",
    likes: 87,
    reposts: 4,
    replies: 2,
    parentId: "post4"
  }
];

export const getUserPosts = (userId: string): Post[] => {
  return posts.filter(post => post.authorId === userId && !post.parentId);
};

export const getPostWithAuthor = (postId: string): PostWithAuthor | undefined => {
  const post = posts.find(p => p.id === postId);
  if (!post) return undefined;
  
  const author = users.find(u => u.id === post.authorId);
  if (!author) return undefined;
  
  return { ...post, author };
};

export const getFeedPosts = (): PostWithAuthor[] => {
  return posts
    .filter(post => !post.parentId)
    .map(post => {
      const author = users.find(u => u.id === post.authorId)!;
      return { ...post, author };
    });
};

export const getPostReplies = (postId: string): PostWithAuthor[] => {
  return posts
    .filter(post => post.parentId === postId)
    .map(post => {
      const author = users.find(u => u.id === post.authorId)!;
      return { ...post, author };
    });
};
