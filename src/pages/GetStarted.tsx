
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Rocket } from "lucide-react";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-6 transition-colors animate-fade-in">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          
          <div className="glass p-8 md:p-12 rounded-3xl animate-scale-in">
            <div className="w-16 h-16 bg-love-100 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-love-600 dark:text-love-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center gradient-text animate-text-shimmer">
              Get Started with LovelyAI
            </h1>
            
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="bg-white/20 dark:bg-midnight-800/20 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4 text-love-600 dark:text-love-400">1. Create Your Account</h2>
                <p className="text-foreground/80">Sign up for a free LovelyAI account to access all our features and personalized AI recommendations.</p>
              </div>
              
              <div className="bg-white/20 dark:bg-midnight-800/20 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4 text-love-600 dark:text-love-400">2. Define Your Preferences</h2>
                <p className="text-foreground/80">Tell us about your interests, relationship status, and what you're looking for to get the most relevant suggestions.</p>
              </div>
              
              <div className="bg-white/20 dark:bg-midnight-800/20 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4 text-love-600 dark:text-love-400">3. Explore Recommendations</h2>
                <p className="text-foreground/80">Browse through our AI-curated suggestions designed specifically for your romantic journey.</p>
              </div>
              
              <Button className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow py-6 text-lg animate-pulse-slow">
                Create Your Free Account
              </Button>
              
              <p className="text-sm text-center text-foreground/60">
                By creating an account, you agree to our <Link to="/terms" className="text-love-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-love-500 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
