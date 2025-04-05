import { createAgent, getActorProfile } from "@/lib/atproto-helpers";
import { User } from "@/types/ResponseSchema";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ProfileDisplay } from "../profile/ProfileDisplay";
import { Button } from "../ui/button";

const agent = createAgent();

interface AuthorHoverCardProps extends PropsWithChildren {
  did: string;
}

export const AuthorHoverCard: FC<AuthorHoverCardProps> = ({
  did,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState<User | undefined>(undefined);

  const fetchAuthor = useCallback(async () => {
    const user = await getActorProfile(agent, did);
    setAuthor(user);
  }, [did]);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && author === undefined) {
      fetchAuthor();
    }
    setOpen(isOpen);
  };

  return (
    <HoverCard
      open={open}
      onOpenChange={handleOpen}
      openDelay={300}
      closeDelay={200}
    >
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {author && (
          <>
            <ProfileDisplay user={author} />
            <Button className="w-full mt-3">Follow</Button>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}