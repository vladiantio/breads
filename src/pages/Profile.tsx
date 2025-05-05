import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useProfile } from "@/lib/atp/hooks/use-profile";
import { useResolveHandle } from "@/lib/atp/hooks/use-resolve-handle";

export function Profile({ handle }: { handle?: string }) {
  const {
    data: actor,
    isLoading: isLoadingActor,
  } = useResolveHandle({ handle });

  const {
    data,
    isLoading: isLoadingProfile,
  } = useProfile({ actor });

  useDocumentTitle(data && (
    data.displayName ? `${data.displayName} (@${data.username})` : `@${data.username}`
  ));

  const isCurrentUser = false;

  if (!handle)
    return "No handle";

  if (isLoadingActor || isLoadingProfile)
    return "Loading...";

  if (!actor)
    return "No actor";

  if (!data)
    return "Nothing to show!";

  return <>
    <ProfileHeader user={data} isCurrentUser={isCurrentUser} />

    <ProfileTabs actor={actor} />
  </>
}
