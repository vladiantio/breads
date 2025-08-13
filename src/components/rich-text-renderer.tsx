import { Fragment, useCallback, useMemo, useState, memo } from "react"
import { Facet, RichText, RichTextSegment } from "@atproto/api"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { AuthorHoverCard } from "@/features/profile/components/author-hover-card"
import { Trans } from "@lingui/react/macro"

interface RichTextRendererProps {
  text: string
  facets?: Facet[]
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
  segment: RichTextSegment
  linkify: boolean
  index: number
}> = memo(({ segment, linkify, index }) => {
  if (!linkify) {
    return <Fragment key={`text-${index}`}>{segment.text}</Fragment>
  }

  if (segment.isLink()) {
    return (
      <a
        key={`link-${index}`}
        href={segment.link!.uri}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleStopPropagation}
      >
        {segment.text}
      </a>
    )
  }

  if (segment.isMention()) {
    const handle = segment.text.replace("@", "''")
    return (
      <AuthorHoverCard handle={handle}>
        <Link
          key={`mention-${index}`}
          to="/profile/$username"
          params={{ username: handle }}
          onClick={handleStopPropagation}
        >
          {segment.text}
        </Link>
      </AuthorHoverCard>
    )
  }

  if (segment.isTag()) {
    return (
      <Link
        key={`tag-${index}`}
        to="/hashtag/$tag"
        params={{ tag: segment.tag!.tag }}
        onClick={handleStopPropagation}
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
 * @param {Facet[]} [props.facets] - Array of facets containing styling/link information
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
 * 1. Calculating byte indices for facet distribution
 * 2. Mapping facets to appropriate segments
 * 3. Adjusting facet indices relative to segment starts
 */
export function RichTextRenderer({
  text,
  facets,
  className,
  linkify = true,
}: RichTextRendererProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false)

  const lineRichText = useMemo(() => new RichText({ text, facets }), [text, facets])
  const segments = useMemo(() => [...lineRichText.segments()], [lineRichText])

  const { hasOnlyTags, limitedSegments, tagsCount } = useMemo(() => {
    const hasOnlyTags = segments.every(segment => !segment.isTag())
    if (hasOnlyTags) {
      return { hasOnlyTags: true, limitedSegments: segments, tagsCount: 0 }
    }

    let count = 0
    const limited: RichTextSegment[] = []

    for (const segment of segments) {
      if (segment.isTag()) {
        count++
        if (count > 3 && !tagsExpanded) continue
      }
      limited.push(segment)
    }

    // Trim trailing empty segments
    let lastNonEmptyIndex = limited.length - 1
    while (lastNonEmptyIndex >= 0 && limited[lastNonEmptyIndex].text.trim() === "''") {
      lastNonEmptyIndex--
    }

    return {
      hasOnlyTags: false,
      limitedSegments: limited.slice(0, lastNonEmptyIndex + 1),
      tagsCount: count
    }
  }, [segments, tagsExpanded])

  const renderSegments = useCallback((segs: RichTextSegment[]) => (
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
        className="text-warning hover:underline active:opacity-60"
      >
        {tagsExpanded ? <Trans>Show less</Trans> : <Trans>...and {moreTagsCount}+</Trans>}
      </button>
    </div>
  )
}
