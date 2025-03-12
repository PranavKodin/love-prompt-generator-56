
import { Heart, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border py-16 bg-gradient-to-b from-background to-secondary/30 dark:from-background dark:to-midnight-900/30">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-love-300/20 dark:via-love-700/20 to-transparent"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-radial from-love-100/10 dark:from-love-900/10 to-transparent opacity-70"></div>
      
      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-love-400/10 dark:text-love-600/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❤
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto mb-12 text-center">
          <h3 className="text-2xl font-bold gradient-text mb-4">Stay Connected</h3>
          <p className="text-foreground/70 mb-6">
            Subscribe to our newsletter for the latest updates and love inspiration
          </p>
          <div className="flex">
            <Input 
              placeholder="Your email address" 
              className="rounded-l-full rounded-r-none border-r-0 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30" 
            />
            <Button 
              className="rounded-r-full rounded-l-none bg-gradient-love hover:opacity-90"
            >
              <Send size={16} className="mr-1" /> Subscribe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">LovelyAI</h3>
            <p className="text-sm text-foreground/70">
              Crafting the perfect compliments for your special someone with advanced AI technology.
            </p>
            <div className="flex space-x-3 mt-4">
              {['Twitter', 'Instagram', 'Facebook'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-white/20 dark:bg-midnight-800/40 flex items-center justify-center hover:bg-love-100 dark:hover:bg-love-900/30 hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <i className={`icon-${social.toLowerCase()}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Features', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={link === 'Home' ? '/' : `#${link.toLowerCase()}`} 
                    className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors group flex items-center"
                  >
                    <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-foreground/70 hover:text-love-600 dark:hover:text-love-400 transition-colors group flex items-center"
                  >
                    <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <address className="not-italic text-sm text-foreground/70 space-y-3">
              <p>1234 Love Lane</p>
              <p>Heartsville, RO 12345</p>
              <p>
                <a 
                  href="mailto:hello@lovelyai.com" 
                  className="hover:text-love-600 dark:hover:text-love-400 transition-colors"
                >
                  hello@lovelyai.com
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-foreground/60 flex items-center justify-center">
            Made with <Heart size={14} className="mx-1.5 text-love-600 dark:text-love-400 animate-pulse-slow" /> by LovelyAI © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
