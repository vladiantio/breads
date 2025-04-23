import { useMemo } from "react"
import { AppBskyActorDefs } from "@atproto/api"

// source: https://github.com/bluesky-social/social-app/blob/main/src/components/verification/index.ts

export type SimpleVerificationState = {
  role: 'default' | 'verifier'
  isVerified: boolean
  showBadge: boolean
}

export function useSimpleVerificationState({
  verification,
}: {
  verification?: AppBskyActorDefs.VerificationState
}): SimpleVerificationState {
  return useMemo(() => {
    if (!verification) {
      return {
        role: 'default',
        isVerified: false,
        showBadge: false,
      }
    }

    const {verifiedStatus, trustedVerifierStatus} = verification
    const isVerifiedUser = ['valid', 'invalid'].includes(verifiedStatus)
    const isVerifierUser = ['valid', 'invalid'].includes(trustedVerifierStatus)
    const isVerified =
      (isVerifiedUser && verifiedStatus === 'valid') ||
      (isVerifierUser && trustedVerifierStatus === 'valid')

    return {
      role: isVerifierUser ? 'verifier' : 'default',
      isVerified,
      showBadge: isVerified,
    }
  }, [verification])
}
