import React from 'react';
import { Button } from '../ui/button';
import UserAvatar from '../shared/UserAvatar';
import { getCurrentUser } from '@/data/users';
import { BellIcon, HomeIcon, SearchIcon, SettingsIcon, SquarePenIcon, UserIcon } from 'lucide-react';
import { NavLink } from './NavLink';

export const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-col justify-between fixed left-0 inset-y-0">
      <div className="p-2 flex flex-col items-center gap-3">
        <UserAvatar user={getCurrentUser()} />
      </div>
      <div className="p-2 flex flex-col items-center gap-3">
        <NavLink 
          icon={HomeIcon}
          label="Home"
          to="/"
        />

        <NavLink 
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

        <NavLink 
          icon={BellIcon}
          label="Notifications"
          to="/notifications"
        />

        <NavLink 
          icon={UserIcon}
          label="Profile"
          to="/profile"
        />
      </div>
      <div className="p-2 flex flex-col items-center gap-3">
        <NavLink 
          icon={SettingsIcon}
          label="Settings"
          to="/settings"
        />
      </div>
    </nav>
  );
};
