import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { t } from "@lingui/core/macro"
import { useRouter } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export function GoBackButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { history } = useRouter()

  return (
    <Button
      className={cn("rounded-full !p-2", className)}
      onClick={() => history.go(-1)}
      title={t`Go back`}
      variant="ghost"
      {...props}
    >
      <ArrowLeft className="size-5" />
    </Button>
  )
}
