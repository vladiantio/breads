import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/data/users';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clickable?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md',
  clickable = true
}) => {  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-20 w-20'
  };
  
  const handleClick = () => {
    // if (clickable) {
    //   navigate(`/profile/${user.username}`);
    // }
  };
  
  return (
    <div className="relative inline-block">
      <Avatar 
        className={`${sizeClasses[size]} ${clickable ? 'cursor-pointer' : ''} transition-all duration-200 hover:opacity-90`}
        onClick={handleClick}
      >
        <AvatarImage src={user.avatar} alt={user.displayName} className="object-cover blur" />
        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserAvatar;
