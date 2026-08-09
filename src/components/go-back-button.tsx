import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { useRouter } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"

export function GoBackButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { history } = useRouter()
  const { t } = useTranslation()

  return (
    <Button
      className={cn("rounded-full !p-2", className)}
      onClick={() => history.go(-1)}
      title={t("common.goBack")}
      variant="ghost"
      {...props}
    >
      <ArrowLeft className="size-5" />
    </Button>
  )
}
