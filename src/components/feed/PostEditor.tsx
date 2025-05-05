import React, { useEffect } from 'react';

interface PostEditorProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
  insertHashtag: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const PostEditor: React.FC<PostEditorProps> = ({ 
  content, 
  onChange, 
  autoFocus = false,
  textareaRef
}) => {
  useEffect(() => {
    // Auto resize textarea when content changes
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, textareaRef]);
  
  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        placeholder="What's happening?"
        value={content}
        onChange={onChange}
        className="w-full resize-none bg-transparent border-none focus:outline-none min-h-[60px]"
        autoFocus={autoFocus}
      />
    </div>
  );
};

export { PostEditor };
