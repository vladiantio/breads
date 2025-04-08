import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/ResponseSchema';
import { useRouter } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: Partial<User>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clickable?: boolean;
  blurred?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md',
  clickable = true,
  blurred = false,
}) => {
  const { navigate } = useRouter();

  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-16',
    '2xl': 'size-20',
  };

  const handleClick = () => {
    if (clickable) {
      navigate({
        to: '/profile/$username',
        params: { username: user.username! }
      });
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar 
        className={`border ${sizeClasses[size]} ${clickable ? 'cursor-pointer' : ''} transition-all duration-200 hover:opacity-90`}
        onClick={handleClick}
      >
        <AvatarImage
          src={user.avatar}
          alt={user.displayName}
          className={cn("object-cover", blurred && "blur-sm")}
        />
        <AvatarFallback>{user.displayName!.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserAvatar;
