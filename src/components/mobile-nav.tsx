import { NavLinks } from "./nav-links"

export const MobileNav: React.FC = () => (
  <>
    <nav className="sticky bottom-0 inset-x-0 z-50 pb-8 px-4">
      <div className="flex items-center justify-around p-1 bg-card/75 backdrop-blur-lg rounded-full mx-auto max-w-sm">
        <NavLinks />
      </div>
    </nav>
    <div className="fixed bottom-0 inset-x-0 z-40 h-16 mask-t-from-0% mask-t-to-100% bg-background"/>
  </>
)
