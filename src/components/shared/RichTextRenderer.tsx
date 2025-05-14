import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { Facet, RichText, RichTextSegment } from '@atproto/api';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { AuthorHoverCard } from '../feed/AuthorHoverCard';

interface RichTextRendererProps {
  text: string;
  facets?: Facet[];
  // Optional className for styling
  className?: string;
  // To control whether to render links as <a> tags
  linkify?: boolean;
}

const handleStopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

// Component for rendering a single segment (link, mention, tag, or plain text)
const TextSegment: FC<{
  segment: RichTextSegment;
  linkify: boolean;
  index: number;
}> = ({ segment, linkify, index }) => {
  if (!linkify) {
    return <Fragment key={`text-${index}`}>{segment.text}</Fragment>;
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
    );
  }

  if (segment.isMention()) {
    const handle = segment.text.replace('@', '');
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
    );
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
    );
  }

  return <Fragment key={`text-${index}`}>{segment.text}</Fragment>;
};

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
export const RichTextRenderer: FC<RichTextRendererProps> = ({
  text,
  facets,
  className,
  linkify = true,
}) => {
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const lineRichText = useMemo(() => new RichText({ text, facets }), [text, facets]);
  const segments = useMemo(() => [...lineRichText.segments()], [lineRichText]);

  const renderSegments = useCallback((segments: RichTextSegment[]) => (
    segments.map((segment, i) => (
      <TextSegment
        key={`segment-${i}`}
        segment={segment}
        linkify={linkify}
        index={i}
      />
    ))
  ), [linkify]);

  // Early return if no tags
  if (segments.every(segment => !segment.isTag())) {
    return <div className={cn("thread-content", className)}>{renderSegments(segments)}</div>;
  }

  const { segments: limitedSegments, tagsCount } = segments.reduce(
    (acc: { segments: RichTextSegment[]; tagsCount: number }, segment) => {
      if (segment.isTag()) {
        acc.tagsCount++;
        if (acc.tagsCount > 3) return acc;
      }
      acc.segments.push(segment);
      return acc;
    },
    { segments: [], tagsCount: 0 }
  );

  if (tagsCount <= 4) {
    return <div className={cn("thread-content", className)}>{renderSegments(segments)}</div>;
  }

  if (tagsExpanded) {
    return (
      <div className={cn("thread-content", className)}>
        {renderSegments(segments)}
        {' '}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTagsExpanded(false);
          }}
          className="text-warning hover:underline active:opacity-60"
        >
          Show less
        </button>
      </div>
    );
  }

  const trimmedSegments = limitedSegments
    .toReversed()
    .dropWhile(segment => segment.text.trim() === '')
    .toReversed();

  return (
    <div className={cn("thread-content", className)}>
      {renderSegments(trimmedSegments)}
      {' '}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setTagsExpanded(true);
        }}
        className="text-warning hover:underline active:opacity-60"
      >
        ...and {tagsCount - 3}+
      </button>
    </div>
  );
};
