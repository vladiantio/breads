import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

/**
 * Formats text content by converting hashtags to clickable links
 */
export const formatContentWithHashtags = (content: string): React.ReactNode[] => {
  // Regex to match hashtags (# followed by letters, numbers, or underscores)
  const hashtagRegex = /(#[\w\d_]+)/g;
  
  // Split the content by hashtags
  const parts = content.split(hashtagRegex);
  
  // Map each part to either plain text or a hashtag link
  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <Link 
          key={index}
          to="/search"
          className="bg-primary/10 hover:bg-primary/15 rounded-md px-2 py-0.5 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }
    
    // This part is plain text
    return <Fragment key={index}>{part}</Fragment>;
  });
};
