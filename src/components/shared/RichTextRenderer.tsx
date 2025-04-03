import { FC, Fragment, JSX, useCallback, useEffect, useState } from 'react';
import { Facet, RichText, RichTextSegment } from '@atproto/api';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface RichTextRendererProps {
  text: string;
  facets?: Facet[];
  // Optional className for styling
  className?: string;
  // To control whether to render links as <a> tags
  linkify?: boolean;
}

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
      >
        {segment.text}
      </a>
    );
  }

  if (segment.isMention()) {
    return (
      <Link
        key={`mention-${index}`}
        to="/profile/$username"
        params={{ username: segment.mention!.did }}
      >
        {segment.text}
      </Link>
    );
  }

  if (segment.isTag()) {
    return (
      <Link
        key={`tag-${index}`}
        to="/hashtag/$tag"
        params={{ tag: segment.tag!.tag }}
      >
        {segment.text}
      </Link>
    );
  }

  return <Fragment key={`text-${index}`}>{segment.text}</Fragment>;
};

// Helper function to calculate byte indices
const calculateByteIndices = (texts: string[], index: number, separator: string = '') => {
  const previousTexts = texts.slice(0, index).join(separator);
  const separatorLength = index > 0 ? new TextEncoder().encode(separator).length : 0;
  const startByteIndex = new TextEncoder().encode(previousTexts).length + separatorLength;
  const currentText = texts[index];
  const endByteIndex = startByteIndex + new TextEncoder().encode(currentText).length;
  
  return { startByteIndex, endByteIndex };
};

// Helper function to filter and adjust facets for a text segment
const adjustFacetsForSegment = (facets: Facet[], startIndex: number, endIndex: number) => {
  return facets
    .filter(facet => 
      facet.index.byteStart >= startIndex && 
      facet.index.byteEnd <= endIndex
    )
    .map(facet => ({
      ...facet,
      index: {
        byteStart: facet.index.byteStart - startIndex,
        byteEnd: facet.index.byteEnd - startIndex
      }
    }));
};

/**
 * A component that renders rich text content with support for facets and paragraphs.
 * Splits text into paragraphs and distributes facets accordingly based on byte indices.
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
 * 1. Splitting text into paragraphs on double newlines
 * 2. Calculating byte indices for facet distribution
 * 3. Mapping facets to appropriate paragraphs
 * 4. Adjusting facet indices relative to paragraph starts
 * 
 * Falls back to simple paragraph splitting if text processing fails
 */
export const RichTextRenderer: FC<RichTextRendererProps> = ({
  text,
  facets,
  className,
  linkify = true,
}) => {
  const [paragraphs, setParagraphs] = useState<JSX.Element[]>([]);

  // Create a RichText line renderer (extracted for reuse)
  const renderLine = useCallback((
    lineText: string, 
    facets: Facet[], 
    paragraphIndex: number, 
    lineIndex: number
  ) => {
    const lineRichText = new RichText({ text: lineText });
    lineRichText.facets = facets;

    const segments = lineRichText.segments();

    return [...segments].map((segment, i) => (
      <TextSegment
        key={`segment-${paragraphIndex}-${lineIndex}-${i}`}
        segment={segment}
        linkify={linkify}
        index={i}
      />
    ));
  }, [linkify]);

  useEffect(() => {
    try {
      // Create and configure the RichText instance
      const richText = new RichText({ text, facets });

      // Split the text into paragraphs
      const paragraphTexts = text.split('\n\n');
      const renderedParagraphs: JSX.Element[] = [];

      // Calculate byte indices and distribute facets to paragraphs
      paragraphTexts.forEach((paragraphText, paragraphIndex) => {
        // Handle empty paragraphs
        if (paragraphText.trim() === '') {
          renderedParagraphs.push(
            <p key={`p-empty-${paragraphIndex}`}>&nbsp;</p>
          );
          return;
        }

        // Get paragraph byte indices
        const { startByteIndex, endByteIndex } = calculateByteIndices(
          paragraphTexts, 
          paragraphIndex, 
          '\n\n'
        );

        // Filter and adjust facets for this paragraph
        const paragraphFacets = adjustFacetsForSegment(
          richText.facets || [], 
          startByteIndex, 
          endByteIndex
        );

        // Split paragraph into lines
        const lines = paragraphText.split('\n');
        const paragraphContent: JSX.Element[] = [];

        // Process each line
        lines.forEach((lineText, lineIndex) => {
          // Get line byte indices
          const { startByteIndex: lineStartByteIndex, endByteIndex: lineEndByteIndex } = 
            calculateByteIndices(lines, lineIndex, '\n');

          // Filter and adjust facets for this line
          const lineFacets = adjustFacetsForSegment(
            paragraphFacets, 
            lineStartByteIndex, 
            lineEndByteIndex
          );

          // Render the line
          const lineSegments = renderLine(lineText, lineFacets, paragraphIndex, lineIndex);

          // Add line content with line breaks
          paragraphContent.push(
            <Fragment key={`line-${paragraphIndex}-${lineIndex}`}>
              {lineSegments}
              {lineIndex < lines.length - 1 && <br />}
            </Fragment>
          );
        });

        // Add the paragraph with all its lines
        renderedParagraphs.push(
          <p key={`p-${paragraphIndex}`}>{paragraphContent}</p>
        );
      });

      setParagraphs(renderedParagraphs);
    } catch (error) {
      console.error('Error rendering rich text:', error);

      // Create fallback paragraphs
      const fallbackParagraphs = text.split('\n\n').map((p, i) => {
        const lines = p.split('\n');
        const lineElements = lines.map((line, j) => (
          <Fragment key={`fallback-line-${i}-${j}`}>
            {line}
            {j < lines.length - 1 && <br />}
          </Fragment>
        ));

        return <p key={`fallback-p-${i}`}>{lineElements}</p>;
      });

      setParagraphs(fallbackParagraphs);
    }
  }, [text, facets, renderLine]);

  return (
    <div className={cn("thread-content", className)}>
      {paragraphs}
    </div>
  );
};
