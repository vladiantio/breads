import { Link } from "@tanstack/react-router";
import { removeHttpAndWww, truncateString } from "./string";
import { Fragment } from "react";
import { AuthorHoverCard } from "@/components/feed/AuthorHoverCard";

// Regular expressions for URLs and email addresses
const mentionRegex = /^(@[\w\d.-]+)/;
const urlRegex = /^(https?:\/\/[^\s]+)|((www\.)?[^\s]+\.[^\d\s]+\/?[^s]*)/;
const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/;

const aClassName = "text-link hover:underline active:opacity-60";

const processLine = (line: string) => {
  // Split the line into segments based on spaces
  const words = line.split(' ');

  return words.map((word, wordIndex) => {
    const space = wordIndex < words.length - 1 ? ' ' : '';

    // Check if the word is a URL
    if (mentionRegex.test(word)) {
      const handle = word.slice(1);
      return (
        <Fragment key={`word-${wordIndex}`}>
          <AuthorHoverCard handle={handle}>
            <Link
              className={aClassName}
              to="/profile/$username"
              params={{
                username: handle
              }}
            >
              {word}
            </Link>
          </AuthorHoverCard>
          {space}
        </Fragment>
      );
    }

    // Check if the word is a URL
    else if (urlRegex.test(word)) {
      const href = word.startsWith('http') ? word.replace(/^http:/, 'https:') : `https://${word}`;
      return (
        <Fragment key={`word-${wordIndex}`}>
          <a
            className={aClassName}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateString(removeHttpAndWww(word))}
          </a>
          {space}
        </Fragment>
      );
    }
    
    // Check if the word is an email
    else if (emailRegex.test(word)) {
      return (
        <Fragment key={`word-${wordIndex}`}>
          <a
            className={aClassName}
            href={`mailto:${word}`}
          >
            {word}
          </a>
          {space}
        </Fragment>
      );
    }
    
    // Return the word as is
    else {
      return (
        <Fragment key={`word-${wordIndex}`}>
          {word}{space}
        </Fragment>
      );
    }
  })
}

// Process the text to replace URLs and emails with components
export const parseBio = (text: string) => {
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    const newLine = lineIndex < lines.length - 1 ? '\n' : '';

    if (line.trim() === '') return newLine;
    
    return (
      <Fragment key={`line-${lineIndex}`}>
        {processLine(line)}{newLine}
      </Fragment>
    );
  });
};
