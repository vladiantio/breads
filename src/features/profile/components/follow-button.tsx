import { Button } from "@/ui/button"
import { Trans } from "@lingui/react/macro"

export function FollowButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
    >
      <Trans>Follow</Trans>
    </Button>
  )
}
