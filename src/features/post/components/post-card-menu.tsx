import {
  ArrowUpRightIcon,
  Copy,
  Flag,
  LanguagesIcon,
  LinkIcon,
  MoreHorizontal,
  XCircle
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu"
import { useTranslation } from "react-i18next"
import { Button } from "@/ui/button"
import { usePostCard } from "./post-card-context"
import { isMobileDevice } from "@/lib/browser"
import { Drawer, DrawerContent, DrawerTrigger } from "@/ui/drawer"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/ui/separator"
import { detectLocale } from "@/i18n/languages"

type AltReaderButtonProps = React.ComponentProps<"button">

const targetLanguage = detectLocale()
const getGTranslateUrl = (source: string, target: string, content: string) => `https://translate.google.com/?sl=${source}&tl=${target}&text=${encodeURIComponent(content)}&op=translate`
const getDeeplUrl = (source: string, target: string, content: string) => `https://www.deepl.com/translator#${source}/${target}/${encodeURIComponent(content)}`

function PostCardMenuButton({
  className,
  onClick: onClickProp,
  ...props
}: AltReaderButtonProps) {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClickProp?.(e)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={onClick}
      {...props}
    >
      <MoreHorizontal className="size-5" />
    </Button>
  )
}

export function PostCardMenu() {
  const {
    onCopyLink,
    onCopyText,
    onNotInterested,
    onReport,
    post: {
      content,
      langs,
    }
  } = usePostCard()
  const [open, setOpen] = useState(false)
  const isMobile = isMobileDevice()
  const { t } = useTranslation()

  const sourceLanguage = useMemo(() => langs?.[0] ?? "en", [langs])

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<PostCardMenuButton />} />
        <DrawerContent>
          <div className="flex flex-col pb-6">
            {(content && content.trim().length > 0
              && sourceLanguage != targetLanguage) ? (
              <>
                <Button
                  render={
                    <a
                      href={getGTranslateUrl(sourceLanguage, targetLanguage, content)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="justify-start h-12"
                  size="lg"
                  variant="ghost"
                >
                  <LanguagesIcon />
                  <span>{t("post.translate.with")} Google Translate</span>
                  <ArrowUpRightIcon className="ml-auto" />
                </Button>
                <Button
                  render={
                    <a
                      href={getDeeplUrl(sourceLanguage, targetLanguage, content)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="justify-start h-12"
                  size="lg"
                  variant="ghost"
                >
                  <LanguagesIcon />
                  <span>{t("post.translate.with")} DeepL</span>
                  <ArrowUpRightIcon className="ml-auto" />
                </Button>
              </>
            ) : null}
            <Button onClick={onCopyLink} className="justify-start h-12" size="lg" variant="ghost">
              <LinkIcon />
              <span>{t("post.menu.copyLink")}</span>
            </Button>
            <Button onClick={onCopyText} className="justify-start h-12" size="lg" variant="ghost">
              <Copy />
              <span>{t("post.menu.copyText")}</span>
            </Button>
            <Separator />
            <Button onClick={onNotInterested} className="justify-start h-12" size="lg" variant="ghost">
              <XCircle />
              <span>{t("post.menu.notInterested")}</span>
            </Button>
            <Button onClick={onReport} className="justify-start h-12" size="lg" variant="ghost-destructive">
              <Flag />
              <span>{t("post.menu.report")}</span>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger render={<PostCardMenuButton />} />
      <DropdownMenuContent align="end" className="w-fit">
        {(content && content.trim().length > 0
          && sourceLanguage != targetLanguage) ? (
          <>
            <DropdownMenuItem
              render={
                <a
                  href={getGTranslateUrl(sourceLanguage, targetLanguage, content)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="cursor-pointer"
            >
              <LanguagesIcon />
              <span>{t("post.translate.with")} Google Translate</span>
              <ArrowUpRightIcon className="ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <a
                  href={getDeeplUrl(sourceLanguage, targetLanguage, content)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="cursor-pointer"
            >
              <LanguagesIcon />
              <span>{t("post.translate.with")} DeepL</span>
              <ArrowUpRightIcon className="ml-auto" />
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem onClick={onCopyLink} className="cursor-pointer">
          <LinkIcon />
          <span>{t("post.menu.copyLink")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyText} className="cursor-pointer">
          <Copy />
          <span>{t("post.menu.copyText")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNotInterested} className="cursor-pointer">
          <XCircle />
          <span>{t("post.menu.notInterested")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReport} className="cursor-pointer" variant="destructive">
          <Flag />
          <span>{t("post.menu.report")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
