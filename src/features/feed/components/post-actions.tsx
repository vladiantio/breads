import React, { useRef } from 'react';
import { Image, Hash } from 'lucide-react';
import { Button } from '@/ui/button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex items-center justify-between">
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
            {t('common.cancel')}
          </Button>
        )}

        <Button
          className="rounded-full"
          disabled={!isValid || isLoading}
          onClick={onPost}
        >
          {isLoading ? 'Posting...' : t('post.publish')}
        </Button>
      </div>
    </div>
  );
};

export { PostActions };
