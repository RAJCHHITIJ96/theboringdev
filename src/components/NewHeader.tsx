import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const NewHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-foreground/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left - Logo - SAME HEIGHT AS NAV ITEMS */}
          <div className="flex items-center h-full">
            <h1 className="text-lg font-bold font-mono tracking-tight text-foreground">
              theboringdev
            </h1>
          </div>

          {/* Right - Navigation + CTA */}
          <div className="flex items-center h-full space-x-8">
            
            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center h-full space-x-8">
              <a href="#intelligence" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Intelligence
              </a>
              <a href="#validation" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Validation
              </a>
              <a href="#trends" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Trends
              </a>
              <a href="#analysis" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Analysis
              </a>
            </nav>

            {/* CTA Button */}
            <button className="btn-primary interactive-element focusable text-sm px-6 py-2">
              <strong>Start Reading →</strong>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-foreground/5 bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-1 px-2 py-3">
              <a 
                href="#intelligence" 
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Intelligence
              </a>
              <a 
                href="#validation" 
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Validation
              </a>
              <a 
                href="#trends" 
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trends
              </a>
              <a 
                href="#analysis" 
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analysis
              </a>
              <div className="px-3 py-2">
                <button className="w-full btn-primary interactive-element focusable text-sm px-6 py-2">
                  <strong>Latest Intel</strong>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NewHeader;