import {
  Copy,
  Flag,
  MoreHorizontal,
  XCircle
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export interface PostCardMenuProps {
  onCopyText: (e: React.MouseEvent) => void;
  onNotInterested: (e: React.MouseEvent) => void;
  onReport: (e: React.MouseEvent) => void;
}

export const PostCardMenu: React.FC<PostCardMenuProps> = ({
  onCopyText,
  onNotInterested,
  onReport,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onCopyText} className="cursor-pointer">
          <Copy className="mr-2" size={16} />
          <span>Copy text</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNotInterested} className="cursor-pointer">
          <XCircle className="mr-2" size={16} />
          <span>Not interested in this post</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReport} className="cursor-pointer" variant="destructive">
          <Flag className="mr-2" size={16} />
          <span>Report post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
