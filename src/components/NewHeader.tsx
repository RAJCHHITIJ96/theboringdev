import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
const NewHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-foreground/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-foreground/5 bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-1 px-2 py-3">
              <a href="#intelligence" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Intelligence
              </a>
              <a href="#validation" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Validation
              </a>
              <a href="#trends" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Trends
              </a>
              <a href="#analysis" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Analysis
              </a>
              <div className="px-3 py-2">
                <button className="w-full btn-primary interactive-element focusable text-sm px-6 py-2">
                  <strong>Latest Intel</strong>
                </button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default NewHeader;