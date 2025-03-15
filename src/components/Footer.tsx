
import { Heart, Facebook, Twitter, Instagram, Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 dark:border-midnight-800/30 backdrop-blur-md">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-6 w-6 text-love-600 dark:text-love-400 animate-pulse-slow" />
            <span className="ml-2 font-bold text-xl">loverprompt</span>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Facebook"
              className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Twitter"
              className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Instagram"
              className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Github"
              className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-medium mb-3">About</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/love-stories" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Love Stories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-foreground/60 text-sm border-t border-white/10 dark:border-midnight-800/30 pt-6">
          <p>&copy; {currentYear} loverprompt. All rights reserved.</p>
          <p className="mt-1">
            Made with <Heart className="inline-block h-3 w-3 text-love-600 dark:text-love-400" /> by the loverprompt Team
          </p>
        </div>
      </div>
    </footer>
  );
}
