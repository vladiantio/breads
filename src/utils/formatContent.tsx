import { Link } from '@tanstack/react-router';
import { Fragment, isValidElement, ReactElement, ReactNode } from 'react';
import { HashtagLimiter } from './HashtagLimiter';

/**
 * Formats text content by converting hashtags to clickable links
 */
export const formatContentWithHashtags = (content: string): ReactNode[] => {
  // Regex to match hashtags (# followed by letters, numbers, or underscores)
  const hashtagRegex = /(#[\w\d_]+)/g;
  
  // Split the content by hashtags
  const parts = content.split(hashtagRegex);
    
  // Extract all hashtags from the content
  const hashtags = content.match(hashtagRegex) || [];
  
  // If we have more than 3 hashtags, we'll need to handle them specially
  if (hashtags.length > 3) {
    // Create a collapsed version that will show the hashtag component later
    return [
      <HashtagLimiter 
        key="hashtag-limiter" 
        content={content} 
        parts={parts} 
        hashtags={hashtags} 
        regex={hashtagRegex}
      />
    ];
  }

  // Map each part to either plain text or a hashtag link
  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <Link 
          key={index}
          to="/search"
        >
          {part}
        </Link>
      );
    }
    
    // This part is plain text
    return <Fragment key={index}>{part}</Fragment>;
  });
};

/**
 * Formats text content by converting @mentions to clickable profile links
 */
export const formatContentWithMentions = (content: string): ReactNode[] => {
  // Regex to match mentions (@ followed by letters, numbers, or underscores)
  const mentionRegex = /(@[\w\d._-]+)/g;
  
  // Split the content by mentions
  const parts = content.split(mentionRegex);
  
  // Map each part to either plain text or a mention link
  return parts.map((part, index) => {
    if (part.match(mentionRegex)) {
      // This part is a mention
      const username = part.substring(1); // Remove the @ symbol
      
      // Create a link of the mentioned user      
      return (
        <Link 
          key={index}
          to="/profile/$username"
          params={{ username }}
        >
          {part}
        </Link>
      );
    }
    
    // This part is plain text
    return <Fragment key={index}>{part}</Fragment>;
  });
};


/**
 * Combined utility to format content with hashtags and mentions
 */
export const formatContent = (content: string): ReactNode => {
  // First process mentions
  const mentionFormatted = formatContentWithMentions(content);
  
  // Then for each text node, process hashtags
  return mentionFormatted.map((node, index) => {
    if (typeof node === 'string' || (isValidElement(node) && node.type === Fragment)) {
      const text = isValidElement(node) ? (node as ReactElement<{ children: string }>).props.children : node;
      return <Fragment key={`hashtag-${index}`}>{formatContentWithHashtags(text)}</Fragment>;
    }
    return node;
  });
};
