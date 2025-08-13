
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg theme-transition border-b border-subtle">
      <div className="container-main">
        <div className="flex items-center justify-between py-large">
          {/* Zone 1 (Top-Left): Logo + primary navigation */}
          <div className="flex items-center space-x-xl">
            <div className="flex items-center">
              <h1 className="text-xl font-bold font-mono-data text-foreground">
                theboringdev
              </h1>
            </div>
            
            {/* SMALL elements - Navigation */}
            <nav className="hidden md:flex items-center">
              <a href="#intelligence" className="nav-item interactive-element focusable">
                Intelligence
              </a>
              <a href="#validation" className="nav-item interactive-element focusable">
                Validation
              </a>
              <a href="#trends" className="nav-item interactive-element focusable">
                Trends
              </a>
              <a href="#analysis" className="nav-item interactive-element focusable">
                Analysis
              </a>
            </nav>
          </div>
          
          {/* Zone 2 (Top-Right): User actions + theme toggle */}
          <div className="flex items-center space-x-medium">
            <button className="btn-secondary interactive-element focusable">
              Start Reading
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
