
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm theme-transition">
      <div className="container-main">
        <div className="flex items-center justify-between py-4">
          {/* Minimal Logo */}
          <div className="flex items-center">
            <h1 className="text-lg font-bold font-mono tracking-tight text-foreground">
              theboringdev
            </h1>
          </div>
          
          {/* Compact Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="#intelligence" className="px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-subtle rounded-md transition-all duration-200">
              Intelligence
            </a>
            <a href="#validation" className="px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-subtle rounded-md transition-all duration-200">
              Validation
            </a>
            <a href="#trends" className="px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-subtle rounded-md transition-all duration-200">
              Trends
            </a>
            <a href="#analysis" className="px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-subtle rounded-md transition-all duration-200">
              Analysis
            </a>
          </nav>
          
          {/* Minimal Action Area */}
          <div className="flex items-center space-x-3">
            <button className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity duration-200">
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
