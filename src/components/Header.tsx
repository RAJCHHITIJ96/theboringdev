
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-background/80 backdrop-blur-md theme-transition">
      <div className="content-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-xl font-bold font-mono text-foreground">
                theboringdev
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="nav-link">
                Latest Intel
              </a>
              <a href="#" className="nav-link">
                Start Reading
              </a>
              <a href="#" className="nav-link">
                Explore Now
              </a>
              <a href="#" className="nav-link">
                Get Updates
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="btn-primary">
              Start Calculating
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
