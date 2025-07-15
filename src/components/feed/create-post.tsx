import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../shared/user-avatar';
// import { useApp } from '@/context/AppContext';
import { PostEditor } from './post-editor';
import { PostActions } from './post-actions';
import { MediaPreview } from './media-preview';
import { useCurrentProfile } from '@/lib/atp/hooks/use-current-profile';

interface CreatePostProps {
  autoFocus?: boolean;
  showCancel?: boolean;
  onCancel?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ 
  autoFocus = false, 
  showCancel = false,
  onCancel
}) => {
  const {
    data: currentUser,
  } = useCurrentProfile();

  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const navigate = useNavigate();
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const insertHashtag = () => {
    const cursorPosition = textareaRef.current?.selectionStart || content.length;
    const textBefore = content.substring(0, cursorPosition);
    const textAfter = content.substring(cursorPosition);
    
    // Add a space before # if the previous character is not a space or beginning of text
    const newHashtag = (textBefore.length > 0 && textBefore[textBefore.length - 1] !== ' ' && textBefore[textBefore.length - 1] !== '\n') 
      ? ' #' 
      : '#';
    
    setContent(textBefore + newHashtag + textAfter);
    
    // Focus the textarea and place cursor after the hashtag
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = cursorPosition + newHashtag.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };
  
  const handlePost = () => {
    if (!content.trim() && !selectedImage) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // createPost(content, selectedImage || undefined);
      setContent('');
      setSelectedImage(null);
      setIsLoading(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      // If in compose page, navigate back
      // if (showCancel) {
      //   navigate('/');
      // }
    }, 500);
  };
  
  const isValid = !!content.trim() || !!selectedImage;
  
  return (
    <article>
      <div className="flex space-x-4 p-4">
        <UserAvatar 
          username={currentUser?.username}
          displayName={currentUser?.displayName}
          src={currentUser?.avatar}
        />
        
        <div className="flex-1">
          <PostEditor 
            content={content}
            onChange={handleTextareaChange}
            autoFocus={autoFocus}
            insertHashtag={insertHashtag}
            textareaRef={textareaRef}
          />
          
          <MediaPreview 
            selectedImage={selectedImage}
            onClearImage={() => setSelectedImage(null)}
          />
          
          <PostActions 
            onImageSelect={handleImageSelect}
            insertHashtag={insertHashtag}
            isLoading={isLoading}
            isValid={isValid}
            onPost={handlePost}
            showCancel={showCancel}
            onCancel={onCancel}
          />
        </div>
      </div>
    </article>
  );
};

export { CreatePost };
