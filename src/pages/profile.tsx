import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useProfile } from "@/lib/atp/hooks/use-profile";
import { useResolveHandle } from "@/lib/atp/hooks/use-resolve-handle";

export function Profile({ handle }: { handle?: string }) {
  const {
    data: actor,
    isLoading: isLoadingActor,
  } = useResolveHandle({ handle });

  const {
    data: user,
    isLoading: isLoadingProfile,
  } = useProfile({ actor });

  useDocumentTitle(user && (
    user.displayName ? `${user.displayName} (@${user.username})` : `@${user.username}`
  ));

  const isCurrentUser = false;

  if (!handle)
    return "No handle";

  if (isLoadingActor || isLoadingProfile)
    return "Loading...";

  if (!actor)
    return "No actor";

  if (!user)
    return "Nothing to show!";

  return <>
    <ProfileHeader user={user} isCurrentUser={isCurrentUser} />

    <ProfileTabs actor={actor} user={user} />
  </>
}
