import { Fragment, useCallback, useMemo, useState, memo } from "react"
import type { RichtextSegment } from "@atcute/bluesky-richtext-segmenter"
import type { AppBskyRichtextFacet } from "@atcute/bluesky"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { AuthorHoverCard } from "@/features/profile/components/author-hover-card"
import { useTranslation } from "react-i18next"
import { segmentizeFacets, type RichtextFeature } from "@/lib/atp/utils"

interface RichTextRendererProps {
  text: string
  facets?: AppBskyRichtextFacet.Main[]
  // Optional className for styling
  className?: string
  // To control whether to render links as <a> tags
  linkify?: boolean
}

const handleStopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}

// Component for rendering a single segment (link, mention, tag, or plain text)
const TextSegment: React.FC<{
  segment: RichtextSegment<RichtextFeature>
  linkify: boolean
  index: number
}> = memo(({ segment, linkify, index }) => {
  if (!linkify) {
    return <Fragment key={`text-${index}`}>{segment.text}</Fragment>
  }

  const feature = segment.features?.[0]

  if (feature?.$type === 'app.bsky.richtext.facet#link') {
    return (
      <a
        key={`link-${index}`}
        href={feature.uri}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleStopPropagation}
        className="relative z-20"
      >
        {segment.text}
      </a>
    )
  }

  if (feature?.$type === 'app.bsky.richtext.facet#mention') {
    const handle = feature.did ?? segment.text.slice(1)
    return (
      <AuthorHoverCard handle={handle}>
        <Link
          key={`mention-${index}`}
          to="/profile/$username"
          params={{ username: handle }}
          onClick={handleStopPropagation}
          className="relative z-20"
        >
          {segment.text}
        </Link>
      </AuthorHoverCard>
    )
  }

  if (feature?.$type === 'app.bsky.richtext.facet#tag') {
    return (
      <Link
        key={`tag-${index}`}
        to="/hashtag/$tag"
        params={{ tag: feature.tag }}
        onClick={handleStopPropagation}
        className="relative z-20"
      >
        {segment.text}
      </Link>
    )
  }

  return <Fragment key={`text-${index}`}>{segment.text}</Fragment>
})

/**
 * A component that renders rich text content with support for facets.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.text - The text content to render
 * @param {AppBskyRichtextFacet.Main[]} [props.facets] - Array of facets containing styling/link information
 * @param {string} [props.className] - Additional CSS class names
 * @param {boolean} [props.linkify=true] - Whether to automatically convert URLs to links
 *
 * @example
 * ```tsx
 * <RichTextRenderer
 *   text="Hello @mention and https://example.com"
 *   facets={[...]} // Facet objects with byte indices
 *   className="custom-class"
 *   linkify={true}
 * />
 * ```
 *
 * @remarks
 * The component handles text processing by:
 * 1. Segmenting the text by facet byte offsets
 * 2. Rendering each segment according to its feature type
 */
export function RichTextRenderer({
  text,
  facets,
  className,
  linkify = true,
}: RichTextRendererProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false)
  const { t } = useTranslation()

  const segments = useMemo(() => segmentizeFacets(text, facets), [text, facets])

  const { hasOnlyTags, limitedSegments, tagsCount } = useMemo(() => {
    const hasOnlyTags = segments.every(segment =>
      !segment.features?.some(feature => feature.$type === 'app.bsky.richtext.facet#tag')
    )
    if (hasOnlyTags) {
      return { hasOnlyTags: true, limitedSegments: segments, tagsCount: 0 }
    }

    let count = 0
    const limited: RichtextSegment<RichtextFeature>[] = []

    for (const segment of segments) {
      const isTag = segment.features?.some(feature => feature.$type === 'app.bsky.richtext.facet#tag') ?? false
      if (isTag) {
        count++
        if (count > 3 && !tagsExpanded) continue
      }
      limited.push(segment)
    }

    // Trim trailing empty segments
    let lastNonEmptyIndex = limited.length - 1
    while (lastNonEmptyIndex >= 0 && limited[lastNonEmptyIndex].text.trim().length == 0) {
      lastNonEmptyIndex--
    }

    return {
      hasOnlyTags: false,
      limitedSegments: limited.slice(0, lastNonEmptyIndex + 1),
      tagsCount: count
    }
  }, [segments, tagsExpanded])

  const renderSegments = useCallback((segs: RichtextSegment<RichtextFeature>[]) => (
    segs.map((segment, i) => (
      <TextSegment
        key={`segment-${i}`}
        segment={segment}
        linkify={linkify}
        index={i}
      />
    ))
  ), [linkify])

  if (hasOnlyTags || tagsCount <= 4) {
    return <div className={cn("thread-content", className)}>{renderSegments(segments)}</div>
  }

  const moreTagsCount = tagsCount - 3

  return (
    <div className={cn("thread-content", className)}>
      {renderSegments(limitedSegments)}
      {" "}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setTagsExpanded(!tagsExpanded)
        }}
        className="text-warning hover:underline active:opacity-60 relative z-20"
      >
        {tagsExpanded ? t("post.tags.showLess") : t("post.tags.more", { moreTagsCount })}
      </button>
    </div>
  )
}
