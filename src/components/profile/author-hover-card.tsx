import { FC, PropsWithChildren, useState } from "react";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/lib/atp/hooks/use-profile";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/hover-card";
import { ProfileDisplay } from "./profile-display";
import { useResolveHandle } from "@/lib/atp/hooks/use-resolve-handle";
import { isMobileDevice } from "@/lib/browser";
import { FollowButton } from "./follow-button";

interface AuthorHoverCardProps extends PropsWithChildren {
  handle?: string;
}

export const AuthorHoverCard: FC<AuthorHoverCardProps> = ({
  handle,
  children,
}) => {
  const [enabled, setEnabled] = useState(false);

  const {
    data: actor,
    isLoading: isLoadingActor,
  } = useResolveHandle({ handle, enabled });

  const {
    data,
    isLoading: isLoadingProfile,
  } = useProfile({ actor, enabled });

  if (isMobileDevice()) return children;

  return (
    <HoverCard
      openDelay={400}
      closeDelay={200}
    >
      <HoverCardTrigger
        onMouseEnter={() => setEnabled(true)}
        asChild
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-6 rounded-xl">
        {(isLoadingActor || isLoadingProfile) ? (
          <Loader2 className="animate-spin" />
        ) : data ? (
          <>
            <ProfileDisplay user={data} />
            <FollowButton className="w-full mt-4" />
          </>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
