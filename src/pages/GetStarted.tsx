
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Rocket, Heart } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";

const GetStarted = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-6 transition-colors animate-fade-in">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          
          {!showLoginForm ? (
            <div className="glass p-8 md:p-12 rounded-3xl animate-scale-in">
              <div className="w-16 h-16 bg-love-100/50 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="h-8 w-8 text-love-600 dark:text-love-400" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center gradient-text animate-text-shimmer">
                Get Started with loverprompt
              </h1>
              
              <div className="space-y-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="bg-white/20 dark:bg-midnight-800/20 p-6 rounded-2xl hover:bg-white/30 dark:hover:bg-midnight-800/30 transition-colors duration-300 group hover:transform hover:scale-[1.02]">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-4 group-hover:bg-love-200 dark:group-hover:bg-love-800/50 transition-colors">
                      <Heart className="h-5 w-5 text-love-600 dark:text-love-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-love-600 dark:text-love-400">1. Create Your Account</h2>
                  </div>
                  <p className="text-foreground/80 ml-14">Sign up for a free loverprompt account to access all our features and personalized AI recommendations.</p>
                </div>
                
                <div className="bg-white/20 dark:bg-midnight-800/20 p-6 rounded-2xl hover:bg-white/30 dark:hover:bg-midnight-800/30 transition-colors duration-300 group hover:transform hover:scale-[1.02]">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-4 group-hover:bg-love-200 dark:group-hover:bg-love-800/50 transition-colors">
                      <Heart className="h-5 w-5 text-love-600 dark:text-love-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-love-600 dark:text-love-400">2. Define Your Preferences</h2>
                  </div>
                  <p className="text-foreground/80 ml-14">Tell us about your interests, relationship status, and what you're looking for to get the most relevant suggestions.</p>
                </div>
                
                <div className="bg-white/20 dark:bg-midnight-800/20 p-6 rounded-2xl hover:bg-white/30 dark:hover:bg-midnight-800/30 transition-colors duration-300 group hover:transform hover:scale-[1.02]">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-4 group-hover:bg-love-200 dark:group-hover:bg-love-800/50 transition-colors">
                      <Heart className="h-5 w-5 text-love-600 dark:text-love-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-love-600 dark:text-love-400">3. Explore Recommendations</h2>
                  </div>
                  <p className="text-foreground/80 ml-14">Browse through our AI-curated suggestions designed specifically for your romantic journey.</p>
                </div>
                
                <Button 
                  className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow py-6 text-lg relative overflow-hidden group"
                  onClick={() => setShowLoginForm(true)}
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  <span className="relative inline-flex items-center">
                    <Heart className="mr-2 animate-pulse-slow" size={20} />
                    Create Your Free Account
                  </span>
                </Button>
                
                <p className="text-sm text-center text-foreground/60">
                  By creating an account, you agree to our <Link to="/terms" className="text-love-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-love-500 hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          ) : (
            <div className="glass p-8 md:p-12 rounded-3xl animate-scale-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center gradient-text animate-text-shimmer">
                Join Our Community
              </h2>
              <div className="flex justify-center">
                <LoginForm />
              </div>
              <Button 
                variant="link" 
                className="mt-4 w-full text-sm text-muted-foreground hover:text-love-500 dark:hover:text-love-400 transition-colors"
                onClick={() => setShowLoginForm(false)}
              >
                Go back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
