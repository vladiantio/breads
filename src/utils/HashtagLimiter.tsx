import { Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";

// Component to handle limiting hashtags display
export const HashtagLimiter = ({ content, parts, hashtags, regex }: { 
  content: string; 
  parts: string[]; 
  hashtags: string[];
  regex: RegExp;
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // If not expanded, we'll show only the first 3 hashtags
  if (!expanded) {
    // Find the positions of the first 3 hashtags
    const firstThreePositions: number[] = [];
    let position = 0;
    let count = 0;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      position += part.length;
      
      if (part.match(regex) && count < 3) {
        firstThreePositions.push(position);
        count++;
      }
    }
    
    // Get the substring that includes only the first 3 hashtags
    const limitedContent = content.substring(0, firstThreePositions[2]);
    const limitedParts = limitedContent.split(regex);
    
    return (
      <>
        {limitedParts.map((part, index) => {
          if (part.match(regex)) {
            return (
              <Link 
                key={index}
                to="/search"
              >
                {part}
              </Link>
            );
          }
          return <Fragment key={index}>{part}</Fragment>;
        })}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="text-warning hover:underline active:opacity-60 ml-2"
        >
          ...and {hashtags.length - 3}+
        </button>
      </>
    );
  }
  
  // If expanded, show all hashtags
  return (
    <>
      {parts.map((part, index) => {
        if (part.match(regex)) {
          return (
            <Link 
              key={index}
              to="/search"
            >
              {part}
            </Link>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(false);
        }}
        className="text-warning hover:underline active:opacity-60 ml-2"
      >
        Show less
      </button>
    </>
  );
}
