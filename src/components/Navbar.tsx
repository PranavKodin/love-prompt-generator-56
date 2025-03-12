
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center pointer-events-none">
      <nav 
        className={cn(
          "max-w-6xl w-full bg-white/30 dark:bg-midnight-900/30 backdrop-blur-md border border-white/20 dark:border-midnight-800/30",
          "rounded-full transition-all duration-500 shadow-glass animate-fade-in pointer-events-auto",
          scrolled ? "py-1" : "py-2"
        )}
      >
        <div className="px-4 flex items-center justify-between h-10">
          <div className="flex items-center">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="mr-2 relative z-50 rounded-full hover:bg-white/20 dark:hover:bg-midnight-800/20"
            >
              <Menu size={20} />
            </Button>
            <a href="/" className="flex items-center space-x-2 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Heart className="absolute text-love-600 dark:text-love-400 transition-all duration-300 group-hover:scale-110 animate-pulse-slow" size={22} />
              </div>
              <span className="font-bold text-lg gradient-text transition-all duration-300 group-hover:opacity-80">
                LovelyAI
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-3 py-1.5 text-foreground/90 hover:text-love-600 dark:hover:text-love-400 font-medium transition-colors overflow-hidden group rounded-full"
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute inset-0 bg-white/30 dark:bg-midnight-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                </a>
              ))}
            </div>
            <ThemeToggle />
            <Button className="bg-gradient-love hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-love-500/20 dark:hover:shadow-love-700/20 rounded-full">
              <span className="animate-pulse-slow">Get Started</span>
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button onClick={toggleMenu} variant="ghost" size="icon" className="relative z-50 rounded-full hover:bg-white/20 dark:hover:bg-midnight-800/20">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-xl transform transition-all duration-500 ease-in-out md:hidden",
            isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col h-full pt-24 px-8 space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xl font-medium py-2 border-b border-border text-foreground/80 hover:text-love-600 dark:hover:text-love-400 transition-all duration-300 hover:pl-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button className="bg-gradient-love hover:opacity-90 mt-6 transition-all duration-300 animate-pulse-slow w-full rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
