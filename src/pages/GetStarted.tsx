import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Rocket, Heart, ArrowRight } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";

const GetStarted = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <div className="h-screen bg-background text-foreground hero-gradient flex items-center justify-center">
      <div className="container max-w-3xl px-4">
        <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-4 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        
        {!showLoginForm ? (
          <div className="glass p-6 rounded-2xl animate-scale-in relative">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-love-100/50 dark:bg-love-900/30 rounded-full flex items-center justify-center">
                <Rocket className="h-6 w-6 text-love-600 dark:text-love-400" />
              </div>
              <h1 className="text-2xl font-bold ml-3 gradient-text animate-text-shimmer">
                Get Started with loverprompt
              </h1>
            </div>
            
            <div className="flex mb-4">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => handleStepClick(step)}
                  className={`flex-1 h-1 mx-1 rounded-full transition-all duration-300 ${
                    activeStep === step ? "bg-love-500" : "bg-love-200 dark:bg-love-900/30"
                  }`}
                />
              ))}
            </div>

            <div className="animate-fade-up h-64 overflow-hidden">
              {activeStep === 1 && (
                <div className="bg-white/20 dark:bg-midnight-800/20 p-4 rounded-xl hover:bg-white/30 dark:hover:bg-midnight-800/30 transition-colors duration-300 group h-full flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-3 group-hover:bg-love-200 dark:group-hover:bg-love-800/50 transition-colors">
                      <Heart className="h-4 w-4 text-love-600 dark:text-love-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-love-600 dark:text-love-400">Create Your Account</h2>
                  </div>
                  <p className="text-foreground/80 ml-11 mb-4">Sign up for a free loverprompt account to access all our features and personalized AI recommendations.</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm text-love-500">Step 1 of 3</span>
                    <Button 
                      size="sm" 
                      className="bg-love-500 hover:bg-love-600 transition-colors"
                      onClick={() => handleStepClick(2)}
                    >
                      Next <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="bg-white/20 dark:bg-midnight-800/20 p-4 rounded-xl hover:bg-white/30 dark:hover:bg-midnight-800/30 transition-colors duration-300 group h-full flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-3 group-hover:bg-love-200 dark:group-hover:bg-love-800/50 transition-colors">
                      <Heart className="h-4 w-4 text-love-600 dark:text-love-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-love-600 dark:text-love-400">Define Your Preferences</h2>
                  </div>
                  <p className="text-foreground/80 ml-11 mb-4">Tell us about your interests, relationship status, and what you're looking for to get the most relevant suggestions.</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm text-love-500">Step 2 of 3</span>
                    <Button 
                      size="sm" 
                      className="bg-love-500 hover:bg-love-600 transition-colors"
                      onClick={() => handleStepClick(3)}
                    >
                      Next <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {activeStep === 3 && (
                <div className="bg-white/20 dark:bg-midnight-800/20 p-4 rounded-xl hover:bg-white/30 dark:hover:bg-midnight-800/30 transition-colors duration-300 group h-full flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-3 group-hover:bg-love-200 dark:group-hover:bg-love-800/50 transition-colors">
                      <Heart className="h-4 w-4 text-love-600 dark:text-love-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-love-600 dark:text-love-400">Explore Recommendations</h2>
                  </div>
                  <p className="text-foreground/80 ml-11 mb-4">Browse through our AI-curated suggestions designed specifically for your romantic journey.</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm text-love-500">Step 3 of 3</span>
                    <Button 
                      size="sm" 
                      className="bg-love-500 hover:bg-love-600 transition-colors"
                      onClick={() => setShowLoginForm(true)}
                    >
                      Get Started <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow py-4 text-base mt-4 relative overflow-hidden group"
              onClick={() => setShowLoginForm(true)}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <span className="relative inline-flex items-center">
                <Heart className="mr-2 animate-pulse-slow" size={18} />
                Create Your Free Account
              </span>
            </Button>
            
            <p className="text-xs text-center text-foreground/60 mt-2">
              By creating an account, you agree to our <Link to="/terms" className="text-love-500 hover:underline">Terms</Link> and <Link to="/privacy" className="text-love-500 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        ) : (
          <div className="glass p-6 rounded-2xl animate-scale-in">
            <h2 className="text-xl font-bold mb-4 text-center gradient-text animate-text-shimmer">
              Join Our Community
            </h2>
            <div className="flex justify-center">
              <LoginForm />
            </div>
            <Button 
              variant="link" 
              className="mt-3 w-full text-sm text-muted-foreground hover:text-love-500 dark:hover:text-love-400 transition-colors"
              onClick={() => setShowLoginForm(false)}
            >
              Go back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted;