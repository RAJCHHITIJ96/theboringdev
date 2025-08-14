
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm theme-transition">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-8">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold font-mono tracking-tight text-foreground">
              theboringdev
            </h1>
          </div>
          
          {/* Middle Section - Navigation wrapped in styled container */}
          <nav className="hidden md:flex items-center bg-[#313131] rounded-lg px-8 py-4">
            <div className="flex items-center space-x-8">
              <a href="#intelligence" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Intelligence
              </a>
              <a href="#validation" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Validation
              </a>
              <a href="#trends" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Trends
              </a>
              <a href="#analysis" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Analysis
              </a>
            </div>
          </nav>
          
          {/* Right Section - CTA and Theme Toggle */}
          <div className="flex items-center space-x-6">
            <button className="hidden sm:inline-flex px-6 py-3 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity duration-200">
              Start Reading
            </button>
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-[#313131] text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
