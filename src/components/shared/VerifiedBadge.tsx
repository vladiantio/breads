import type { AppBskyActorDefs } from "@atproto/api";
import { useSimpleVerificationState } from "@/lib/atp/hooks/use-verification";
import TrustedVerifierIcon from "@/icons/trusted-verifier.svg?react";
import VerifiedAccountIcon from "@/icons/verified-account.svg?react";

export function VerifiedBadge({
  className,
  verification,
}: {
  className?: string,
  verification?: AppBskyActorDefs.VerificationState
}) {
  const { isVerified, role } = useSimpleVerificationState({ verification });

  if (isVerified && role === 'verifier')
    return (<TrustedVerifierIcon className={className} />);
  else if (isVerified)
    return (<VerifiedAccountIcon className={className} />);

  return null;
}
