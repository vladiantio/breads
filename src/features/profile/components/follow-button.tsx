import { Button } from "@/ui/button"
import { useTranslation } from "react-i18next"

export function FollowButton(props: React.ComponentProps<typeof Button>) {
  const { t } = useTranslation()
  return (
    <Button
      {...props}
    >
      {t("profile.follow")}
    </Button>
  )
}
