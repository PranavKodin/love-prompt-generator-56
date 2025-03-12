
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 hero-gradient">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="glass max-w-md w-full p-8 rounded-xl text-center animate-scale-in">
        <div className="w-16 h-16 bg-love-100 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-8 w-8 text-love-600 dark:text-love-400" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 gradient-text">404</h1>
        <h2 className="text-xl font-semibold mb-4">Oops! Page not found</h2>
        <p className="text-foreground/80 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
