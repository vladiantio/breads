import { UserAvatar } from "@/components/user-avatar"
import { LogInIcon, SettingsIcon } from "lucide-react"
import { NavIconLink } from "./nav-icon-link"
import { NavLinks } from "./nav-links"
import { useCurrentProfile } from "@/lib/atp/hooks/use-current-profile"
import { t } from "@lingui/core/macro"

export function Navbar() {
  const {
    data: profile,
    isAuthenticated,
  } = useCurrentProfile()

  return (
    <nav className="flex flex-col justify-between fixed left-0 inset-y-0 p-4">
      <div className="flex flex-col items-center gap-1">
        {isAuthenticated ? (
          <UserAvatar
            size="lg"
            displayName={profile?.displayName}
            username={profile?.username}
            src={profile?.avatar}
          />
        ) : (
          <NavIconLink
            icon={LogInIcon}
            label={t`Log in`}
            to="/login"
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <NavLinks />
      </div>
      <div className="flex flex-col items-center gap-1">
        <NavIconLink
          icon={SettingsIcon}
          label={t`Settings`}
          to="/settings"
        />
      </div>
    </nav>
  )
}
