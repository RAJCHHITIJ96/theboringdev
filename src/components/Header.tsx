
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md theme-transition border-b border-foreground/8">
      <div className="container-main">
        <div className="flex items-center justify-between py-6">
          {/* Zone 1 (Top-Left): Logo + primary navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-xl font-bold font-mono text-foreground">
                theboringdev
              </h1>
            </div>
            
            {/* SMALL elements - Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors focusable">
                Latest Intel
              </a>
              <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors focusable">
                Start Reading
              </a>
              <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors focusable">
                Explore Now
              </a>
              <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors focusable">
                Get Updates
              </a>
            </nav>
          </div>
          
          {/* Zone 2 (Top-Right): User actions + theme toggle */}
          <div className="flex items-center space-x-4">
            <button className="btn-secondary interactive-hover focusable">
              Start Calculating
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
