import { ReactNode } from 'react';
import { Navbar } from '../navigation/navbar';
import { MobileNav } from '../navigation/mobile-nav';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-dvh bg-background">

      <div className="max-w-[64ch] mx-auto flex-1 w-full">
        {!isMobile && <Navbar />}
        <main>
          {children}
        </main>
      </div>

      {isMobile && <MobileNav />}

    </div>
  );
};
