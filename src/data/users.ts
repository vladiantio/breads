export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  following: number;
  followers: number;
  joinDate: string;
  isFollowing?: boolean;
}

/**
 * CHARACTER LIMITS:
 * - Bio: 250
 */
export const users: User[] = [
  {
    id: "user1",
    username: "loremipsum.com",
    displayName: "Lorem Ipsum",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    banner: "https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80",
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut deleniti excepturi sapiente, ea impedit quaerat, amet voluptatum in illum nesciunt nihil velit. Cupiditate ipsa veritatis velit dolor corporis assumenda culpa.",
    following: 844,
    followers: 70,
    joinDate: "2023-01-15",
    isFollowing: true,
  },
  {
    id: "user2",
    username: "amandadesigns.xyz",
    displayName: "Amanda Chen",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    banner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80",
    bio: "UX/UI Designer • Creating digital experiences that bring joy • Currently @DesignStudio",
    following: 567,
    followers: 12500,
    joinDate: "2023-04-22",
    isFollowing: true,
  },
  {
    id: "user3",
    username: "techvision.new",
    displayName: "Tech Vision",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    banner: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80",
    bio: "Exploring the cutting edge of technology. AI enthusiast and software developer.",
    following: 289,
    followers: 45600,
    joinDate: "2022-11-05"
  },
  {
    id: "user4",
    username: "sophiawrites.bsky.social",
    displayName: "Sophia Williams",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    banner: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80",
    bio: "Writer • Bibliophile • Coffee addict ☕ • Author of 'Midnight Whispers'",
    following: 734,
    followers: 28900,
    joinDate: "2023-02-18"
  },
  {
    id: "user5",
    username: "alextravels.bsky.social",
    displayName: "Alex Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80",
    bio: "Traveling the world, one country at a time 🌎 • Photographer • Digital nomad",
    following: 1209,
    followers: 89300,
    joinDate: "2022-09-30",
    isFollowing: true
  },
  {
    id: "user6",
    username: "currentuser",
    displayName: "You",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    bio: "This is your profile. Edit your bio to tell the world about yourself.",
    following: 235,
    followers: 412,
    joinDate: "2023-05-10"
  }
];

export const getUser = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};

export const getCurrentUser = (): User => {
  return users[0];
};

export const getRecommendedUsers = (): User[] => {
  return users.filter(user => user.username !== "currentuser").slice(0, 3);
};
