import React from 'react';
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { NavIconLink } from './NavIconLink';
import { Button } from '../ui/button';
import { getCurrentUser } from '@/data/users';

export const MobileNav: React.FC = () => {
  return (
    <nav className="sticky bottom-0 inset-x-0 bg-background border-t z-50">
      <div className="flex items-center justify-around p-2">
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
          to="/profile/$username"
          params={{
            username: getCurrentUser().username,
          }}
          fillOnHover
        />
      </div>
    </nav>
  );
};
