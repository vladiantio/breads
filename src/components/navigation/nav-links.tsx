import { NavIconLink } from "./nav-icon-link";
import { Button } from "@/ui/button";
import HomeIcon from '@/icons/home.svg?react';
import SearchIcon from '@/icons/search.svg?react';
import SquarePenIcon from '@/icons/square-pen.svg?react';
import BellIcon from '@/icons/bell.svg?react';
import UserIcon from '@/icons/person-rounded.svg?react';
import { useAtpStore } from "@/lib/atp/store";
import { t } from "@lingui/core/macro";

export const NavLinks: React.FC = () => {
  const { isAuthenticated, session } = useAtpStore();

  return (
    <>
      <NavIconLink 
        icon={HomeIcon}
        label={t`Home`}
        to="/"
        fillOnHover
      />

      <NavIconLink 
        icon={SearchIcon}
        label={t`Search`}
        to="/search"
      />

      <Button
        title={t`New Post`}
        size="icon"
        className="p-6 rounded-full"
      >
        <SquarePenIcon className="size-6" />
      </Button>

      <NavIconLink 
        icon={BellIcon}
        label={t`Notifications`}
        to={isAuthenticated ? "/notifications" : "/login"}
        fillOnHover
      />

      <NavIconLink 
        icon={UserIcon}
        label={t`Profile`}
        to={isAuthenticated ? "/profile/$username" : "/login"}
        params={{
          username: session?.handle,
        }}
        fillOnHover
      />
    </>
  );
}
