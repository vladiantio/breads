import { FC, Fragment, useCallback, useEffect, useState } from 'react';
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
  index: string;
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

// Component for rendering a paragraph with rich text segments
const RichTextParagraph: FC<{
  text: string;
  facets: Facet[];
  linkify: boolean;
  index: number;
}> = ({ text, facets, linkify, index }) => {
  const renderSegments = useCallback(() => {
    try {
      // If paragraph is empty, render a non-breaking space
      if (text.trim() === '') {
        return <>&nbsp;</>;
      }
      
      // Create a RichText instance for this paragraph
      const richText = new RichText({ text, facets });
      
      // Get segments and render them
      const segments = richText.segments();
      return [...segments].map((segment, i) => (
        <TextSegment
          key={`segment-${i}`}
          segment={segment}
          linkify={linkify}
          index={`${index}-${i}`}
        />
      ));
    } catch (error) {
      console.error('Error rendering paragraph:', error);
      return text;
    }
  }, [text, facets, linkify, index]);

  return (
    <p key={`p-${index}`}>{renderSegments()}</p>
  );
};

/**
 * A component that renders rich text content with support for facets and paragraphs.
 * Splits text into paragraphs and distributes facets accordingly based on byte indices.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.text - The text content to render
 * @param {Facet[]} [props.facets] - Array of facets containing styling/link information
 * @param {string} [props.className=''] - Additional CSS class names
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
  className = '',
  linkify = true,
}) => {
  const [paragraphs, setParagraphs] = useState<{
    text: string;
    facets: Facet[];
  }[]>([]);

  useEffect(() => {
    try {        
      // Split the text into paragraphs
      const paragraphTexts = text.split('\n\n');
      const processedParagraphs = [];
        
      // Calculate byte indices and distribute facets to paragraphs
      let byteIndex = 0;
      for (const paragraphText of paragraphTexts) {
        const paragraphByteLength = new TextEncoder().encode(paragraphText).length;
        const paragraphEndByteIndex = byteIndex + paragraphByteLength;
        
        // Find facets that belong to this paragraph and adjust their indices
        const paragraphFacets = (facets ?? [])
          .filter(facet => 
            facet.index.byteStart >= byteIndex && 
            facet.index.byteEnd <= paragraphEndByteIndex
          )
          .map(facet => ({
            ...facet,
            index: {
              byteStart: facet.index.byteStart - byteIndex,
              byteEnd: facet.index.byteEnd - byteIndex
            }
          }));
        
        processedParagraphs.push({
          text: paragraphText,
          facets: paragraphFacets
        });
        
        // Update byte index for the next paragraph (add paragraph text length plus newlines)
        byteIndex = paragraphEndByteIndex + 2; // +2 for '\n\n'
      }
      
      setParagraphs(processedParagraphs);
    } catch (error) {
      console.error('Error processing rich text:', error);
      // Fallback to simple paragraph splitting
      const simpleParagraphs = text.split('\n\n').map(p => ({ 
        text: p, 
        facets: [] 
      }));
      
      setParagraphs(simpleParagraphs);
    }
  }, [text, facets]);

  return (
    <div className={cn("thread-content", className)}>
      {paragraphs.map((paragraph, index) => (
        <RichTextParagraph
          key={`para-${index}`}
          text={paragraph.text}
          facets={paragraph.facets}
          linkify={linkify}
          index={index}
        />
      ))}
    </div>
  );
};
