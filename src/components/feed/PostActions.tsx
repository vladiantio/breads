import React, { useRef } from 'react';
import { Image, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostActionsProps {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  insertHashtag: () => void;
  isLoading: boolean;
  isValid: boolean;
  onPost: () => void;
  showCancel?: boolean;
  onCancel?: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  onImageSelect,
  insertHashtag,
  isLoading,
  isValid,
  onPost,
  showCancel = false,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-x-1 -mx-3">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onImageSelect}
        />
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full text-muted-foreground"
          onClick={insertHashtag}
        >
          <Hash size={20} />
        </Button>
      </div>

      <div className="flex gap-x-1">
        {showCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          className="rounded-full"
          disabled={!isValid || isLoading}
          onClick={onPost}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export default PostActions;
