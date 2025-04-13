import React from 'react';
import { NavLinks } from './NavLinks';

export const MobileNav: React.FC = () => {
  return (
    <>
      <nav className="sticky bottom-0 inset-x-0 z-50 pb-8 px-4">
        <div className="flex items-center justify-around p-2 bg-card/75 backdrop-blur-lg rounded-2xl mx-auto max-w-sm">
          <NavLinks />
        </div>
      </nav>
      <div className="fixed bottom-0 inset-x-0 z-40 h-16 mask-t-from-0% mask-t-to-100% bg-background"/>
    </>
  );
};
