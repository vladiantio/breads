import { ReactNode } from 'react';
import { Navbar } from '../navigation/Navbar';
import { MobileNav } from '../navigation/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-dvh bg-background">
      {!isMobile && <Navbar />}

      <div className="md:px-15 py-4">
        <div className="max-w-[75ch] mx-auto">
          {children}
        </div>
      </div>
      
      {isMobile && <MobileNav />}
    </div>
  );
};
