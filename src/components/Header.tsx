
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm theme-transition">
      <div className="container-main">
        <div className="flex items-center justify-between py-6">
          {/* Navigation Bar with new styling */}
          <nav className="flex items-center bg-[#313131] rounded-lg px-6 py-3">
            {/* Logo */}
            <div className="flex items-center mr-8">
              <h1 className="text-lg font-bold font-mono tracking-tight text-white">
                theboringdev
              </h1>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 mr-8">
              <a href="#intelligence" className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Intelligence
              </a>
              <a href="#validation" className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Validation
              </a>
              <a href="#trends" className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Trends
              </a>
              <a href="#analysis" className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200">
                Analysis
              </a>
            </div>
            
            {/* CTA Button */}
            <button className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium bg-white text-[#313131] rounded-md hover:opacity-90 transition-opacity duration-200">
              Latest Intel
            </button>
          </nav>
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
