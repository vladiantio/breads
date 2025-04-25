import { NavIconLink } from "./NavIconLink";
import { Button } from "../ui/button";
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { useAtpStore } from "@/lib/atp/store";

export const NavLinks: React.FC = () => {
  const { isAuthenticated, session } = useAtpStore();

  return (
    <>
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

      {isAuthenticated && (
        <>
          <Button
            title="New Post"
            size="icon"
            className="px-7 py-6"
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
              username: session?.handle,
            }}
            fillOnHover
          />
        </>
      )}
    </>
  );
}
