
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="font-medium text-lg transition-opacity hover:opacity-80"
        >
          <span className="text-primary">Project</span>Tracker
        </Link>
        
        <nav className="flex items-center space-x-1">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              size="sm" 
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          
          <Link to="/chat">
            <Button 
              variant={location.pathname === '/chat' ? 'default' : 'ghost'} 
              size="sm" 
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
          </Link>
          
          <Link to="/create">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
