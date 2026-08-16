import { ArrowDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/ui/button"
import { Spinner } from "@/ui/spinner"

interface LoadMoreButtonProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onClick: () => void
}

export function LoadMoreButton({
  hasNextPage,
  isFetchingNextPage,
  onClick,
}: LoadMoreButtonProps) {
  const { t } = useTranslation()

  return (
    <div className="text-center p-4">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage && <Spinner />}
        {hasNextPage
          ? t("common.pagination.loadMore")
          : t("common.pagination.none")}
        {hasNextPage && <ArrowDown />}
      </Button>
    </div>
  )
}
