import { FC, PropsWithChildren, useState } from "react";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/lib/atp/hooks/use-profile";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ProfileDisplay } from "../profile/ProfileDisplay";
import { Button } from "../ui/button";

interface AuthorHoverCardProps extends PropsWithChildren {
  handle?: string;
}

export const AuthorHoverCard: FC<AuthorHoverCardProps> = ({
  handle,
  children,
}) => {
  const [enabled, setEnabled] = useState(false);
  const {
    data,
    isLoading,
  } = useProfile({ actor: handle, enabled });

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
        {isLoading && <Loader2 className="animate-spin" />}
        {data && (
          <>
            <ProfileDisplay user={data} />
            <Button className="w-full mt-3">Follow</Button>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
