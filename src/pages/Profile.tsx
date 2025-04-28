import ProfileHeader from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useProfile } from "@/lib/atp/hooks/use-profile";

export function Profile({ handle }: { handle?: string }) {
  const {
    data,
    isLoading,
  } = useProfile({
    handle
  });

  useDocumentTitle(data && (
    data.displayName ? `${data.displayName} (@${data.username})` : `@${data.username}`
  ));

  const isCurrentUser = false;

  if (!handle)
    return "No handle";

  if (isLoading)
    return "Loading...";

  if (!data)
    return "Nothing to show!";

  return <>
    <ProfileHeader user={data} isCurrentUser={isCurrentUser} />

    <ProfileTabs handle={handle} />
  </>
}
