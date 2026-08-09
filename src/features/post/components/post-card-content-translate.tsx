import { useMemo, useState } from "react"
import { AlertCircleIcon } from "lucide-react"
import { detectLocale } from "@/i18n/languages"
import { Alert, AlertTitle } from "@/ui/alert"
import { Button } from "@/ui/button"
import { ShiningText } from "@/ui/shining-text"
import { usePostCard } from "./post-card-context"
import { useTranslation } from "react-i18next"

const isTranslatorSupported = "Translator" in self
const targetLanguage = detectLocale()

export function PostCardContentTranslate() {
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslatedContent, setShowTranslatedContent] = useState(true)
  const [error, setError] = useState("")
  const [translatedContent, setTranslatedContent] = useState("")
  const { t } = useTranslation()

  const {
    post: {
      content,
      langs,
    },
  } = usePostCard()

  const sourceLanguage = useMemo(() => langs?.[0] ?? "en", [langs])

  const translate = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (translatedContent && !error) {
      setShowTranslatedContent(prev => !prev)
      return
    }

    setError("")
    setIsTranslating(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = self as typeof self & { Translator: any }
      const availability = await win.Translator.availability({ sourceLanguage, targetLanguage })
      if (availability === 'unavailable')
        throw new Error(`${sourceLanguage} - ${targetLanguage} pair is not supported.`)
      const translator = await win.Translator.create({ sourceLanguage, targetLanguage })
      const stream = translator.translateStreaming(content.trim())
      for await (const chunk of stream) {
        setTranslatedContent(prev => prev + chunk)
      }
    } catch (e) {
      setError((e as Error).message)
    }
    setIsTranslating(false)
  }

  return (content 
    && content.trim().length > 0 
    && isTranslatorSupported 
    && sourceLanguage != targetLanguage) ? (
    <>
      {isTranslating ? (
        <ShiningText className="block text-sm">{t("post.translate.inProgress")}</ShiningText>
      ) : (translatedContent && showTranslatedContent) ? (
        <Button
          variant="link"
          className="block h-auto p-0"
          onClick={translate}
        >
          {t("post.translate.done")} <strong>Translator API</strong>
        </Button>
      ) : (
        <Button
          variant="link"
          className="block h-auto p-0"
          onClick={translate}
        >
          {t("post.translate.action")}
        </Button>
      )}
      {(translatedContent && showTranslatedContent) && (
        <div className="thread-content">{translatedContent}</div>
      )}
      {error && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
    </>
  ) : null
}