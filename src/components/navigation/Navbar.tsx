import React from 'react';
import { Button } from '../ui/button';
import UserAvatar from '../shared/UserAvatar';
import { getCurrentUser } from '@/data/users';
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { SettingsIcon } from 'lucide-react';
import { NavIconLink } from './NavIconLink';

export const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-col justify-between fixed left-0 inset-y-0">
      <div className="p-2 flex flex-col items-center gap-3">
        <UserAvatar user={getCurrentUser()} />
      </div>
      <div className="p-2 flex flex-col items-center gap-3">
        <NavIconLink 
          icon={HomeIcon}
          label="Home"
          to="/"
          fillOnHover
        />

        <NavIconLink 
          icon={SearchIcon}
          label="Search"
          to="/search"
        />

        <Button 
          title="New Post"
          className="py-5"
        >
          <SquarePenIcon className="size-6" />
        </Button>

        <NavIconLink 
          icon={BellIcon}
          label="Notifications"
          to="/notifications"
          fillOnHover
        />

        <NavIconLink 
          icon={UserIcon}
          label="Profile"
          to="/profile"
          fillOnHover
        />
      </div>
      <div className="p-2 flex flex-col items-center gap-3">
        <NavIconLink 
          icon={SettingsIcon}
          label="Settings"
          to="/settings"
        />
      </div>
    </nav>
  );
};
