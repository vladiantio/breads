export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  following: number;
  followers: number;
  joinDate: string;
  isFollowing?: boolean;
  isVerified?: boolean;
}

export const users: User[] = [
  {
    id: "user1",
    username: "vladiantio.com",
    displayName: "Vladimir Antonio F. C.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Technoking of Alset, Imperator of Venus 🚀 Building the future of transportation and sustainable energy",
    following: 152,
    followers: 134700000,
    joinDate: "2023-01-15",
    isFollowing: true,
  },
  {
    id: "user2",
    username: "amandadesigns",
    displayName: "Amanda Chen",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "UX/UI Designer • Creating digital experiences that bring joy • Currently @DesignStudio",
    following: 567,
    followers: 12500,
    joinDate: "2023-04-22",
    isFollowing: true,
  },
  {
    id: "user3",
    username: "techvision",
    displayName: "Tech Vision",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Exploring the cutting edge of technology. AI enthusiast and software developer.",
    following: 289,
    followers: 45600,
    joinDate: "2022-11-05"
  },
  {
    id: "user4",
    username: "sophia_writes",
    displayName: "Sophia Williams",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Writer • Bibliophile • Coffee addict ☕ • Author of 'Midnight Whispers'",
    following: 734,
    followers: 28900,
    joinDate: "2023-02-18"
  },
  {
    id: "user5",
    username: "alex_travels",
    displayName: "Alex Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
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
  return users.find(user => user.username === "currentuser") || users[5];
};

export const getRecommendedUsers = (): User[] => {
  return users.filter(user => user.username !== "currentuser").slice(0, 3);
};
