import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const getAnimationByDevice = () => {
  if (typeof window === 'undefined') return 'animate-fade-in';
  
  const width = window.innerWidth;
  if (width < 640) return 'animate-slide-in-mobile'; // Mobile
  if (width < 1024) return 'animate-fade-in-tablet'; // Tablet
  if (width < 1536) return 'animate-scale-in-desktop'; // Desktop
  return 'animate-blur-in-tv'; // Large screens/TVs
};

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleResize = () => {
      setAnimationClass(getAnimationByDevice());
    };

    setAnimationClass(getAnimationByDevice());

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = () => {
    if (!user || !user.displayName) return "U";
    
    const nameParts = user.displayName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const navLinks = [
    { name: "Home", href: "/", animation: "animate-text-fade" },
    { name: "About", href: "/about", animation: "animate-text-slide" },
    { name: "Features", href: "/features", animation: "animate-text-scale" },
    { name: "Discover", href: "/discover", animation: "animate-text-pulse" },
    { name: "Contact", href: "/contact", animation: "animate-text-shimmer" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center pointer-events-none">
      <nav 
        className={cn(
          "max-w-6xl w-full bg-white/30 dark:bg-midnight-900/30 backdrop-blur-md border border-white/20 dark:border-midnight-800/30",
          "rounded-full transition-all duration-500 shadow-glass pointer-events-auto",
          scrolled ? "py-1" : "py-2",
          animationClass
        )}
      >
        <div className="px-4 flex items-center justify-between h-10">
          <div className="flex items-center">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="mr-2 relative z-50 rounded-full hover:bg-white/20 dark:hover:bg-midnight-800/20 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <Menu size={20} />
            </Button>
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/loverprompt.png" 
                alt="LoverPrompt Logo" 
                className="h-8 transition-all duration-300 group-hover:opacity-80 animate-text-shimmer"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "relative px-3 py-1.5 text-foreground/90 hover:text-love-600 dark:hover:text-love-400 font-medium transition-colors overflow-hidden group rounded-full",
                    link.animation
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 will-change-auto">{link.name}</span>
                  <span className="absolute inset-0 bg-white/30 dark:bg-midnight-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                </Link>
              ))}
            </div>
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0 overflow-hidden border-2 border-love-300/50 dark:border-love-700/50 hover:border-love-400 dark:hover:border-love-600 transition-colors">
                    <Avatar>
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-gradient-love text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/80 dark:bg-midnight-800/80 backdrop-blur-lg border border-white/20 dark:border-white/10">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      {user.email && (
                        <p className="text-sm text-muted-foreground truncate w-40">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/get-started">
                <Button 
                  className="bg-gradient-love hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-love-500/20 dark:hover:shadow-love-700/20 rounded-full animate-blur-in"
                  style={{ animationDelay: "500ms" }}
                >
                  <span className="animate-pulse-slow">Get Started</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 overflow-hidden border-2 border-love-300/50 dark:border-love-700/50">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-gradient-love text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/80 dark:bg-midnight-800/80 backdrop-blur-lg border border-white/20 dark:border-white/10">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      {user.email && (
                        <p className="text-sm text-muted-foreground truncate w-40">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/get-started">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-full hover:bg-white/20 dark:hover:bg-midnight-800/20"
                >
                  <Heart className="h-5 w-5 text-love-600 dark:text-love-400" />
                </Button>
              </Link>
            )}
            <Button onClick={toggleMenu} variant="ghost" size="icon" className="relative z-50 rounded-full hover:bg-white/20 dark:hover:bg-midnight-800/20">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        <div 
          className={cn(
            "fixed inset-0 z-40 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-xl transform transition-all duration-500 ease-in-out md:hidden",
            isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col h-full pt-24 px-8 space-y-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-xl font-medium py-2 border-b border-border text-foreground/80 hover:text-love-600 dark:hover:text-love-400 transition-all duration-300 hover:pl-2",
                  isMenuOpen ? link.animation : ""
                )}
                style={{ animationDelay: `${index * 150 + 200}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link to="/get-started" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  className="bg-gradient-love hover:opacity-90 mt-6 transition-all duration-300 animate-pulse-slow w-full rounded-full"
                  style={{ animationDelay: "800ms" }}
                >
                  Get Started
                </Button>
              </Link>
            )}
            {user && (
              <Button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                variant="outline"
                className="mt-6 border-love-200/50 dark:border-love-800/30"
                style={{ animationDelay: "800ms" }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}