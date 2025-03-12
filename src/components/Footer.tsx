
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 bg-secondary/50 dark:bg-midnight-900/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">LovelyAI</h3>
            <p className="text-sm text-foreground/80">
              Crafting the perfect compliments for your special someone with advanced AI technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#api" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  API Access
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-foreground/60 flex items-center justify-center">
            Made with <Heart size={14} className="mx-1 text-love-600" /> by LovelyAI © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
