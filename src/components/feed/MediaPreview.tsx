import React from 'react';
import { X } from 'lucide-react';

interface MediaPreviewProps {
  selectedImage: string | null;
  onClearImage: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  selectedImage, 
  onClearImage 
}) => {
  if (!selectedImage) return null;
  
  return (
    <div className="relative mt-4 rounded-xl overflow-hidden">
      <img 
        src={selectedImage} 
        alt="Selected" 
        className="w-full rounded-xl border"
      />
      <button
        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
        onClick={onClearImage}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default MediaPreview;
