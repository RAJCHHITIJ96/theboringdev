
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b border-border-subtle theme-transition">
      <div className="content-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold font-serif">theboringdev</h1>
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Overview
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
