
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Facebook, 
  Mail, 
  LogIn, 
  Key, 
  User, 
  Globe, 
  LucideIcon,
  Eye,
  EyeOff 
} from "lucide-react";

interface AuthButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
}

const AuthButton = ({ onClick, icon: Icon, label, className, variant = "outline" }: AuthButtonProps) => (
  <Button
    type="button"
    variant={variant}
    onClick={onClick}
    className={`w-full relative overflow-hidden group transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-love-400/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
    <div className="relative flex items-center justify-center space-x-2">
      <Icon className="mr-2 h-4 w-4 animate-pulse-slow" />
      <span>{label}</span>
    </div>
  </Button>
);

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    user,
    signInWithGoogle, 
    signInWithFacebook, 
    signInWithEmail, 
    signUpWithEmail 
  } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      navigate("/");
    } catch (error) {
      console.error("Facebook sign in error:", error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white/20 dark:bg-midnight-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-white/10 shadow-glass transition-all duration-300 hover:shadow-love-500/10">
      <div className="text-center space-y-2">
        <div className="inline-flex bg-love-100/20 dark:bg-love-900/30 p-3 rounded-full mb-2">
          <User className="h-6 w-6 text-love-600 dark:text-love-400" />
        </div>
        <h3 className="text-xl font-bold gradient-text">{isSignUp ? "Create Account" : "Welcome Back"}</h3>
        <p className="text-sm text-foreground/70">
          {isSignUp 
            ? "Sign up to access all features" 
            : "Sign in to continue your journey"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm flex items-center">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-love-500 dark:text-love-400" />
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30 pr-10 placeholder:text-foreground/40"
            />
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm flex items-center">
            <Key className="h-3.5 w-3.5 mr-1.5 text-love-500 dark:text-love-400" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30 pr-10 placeholder:text-foreground/40"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40 hover:text-love-500 dark:hover:text-love-400 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300 button-glow py-5 rounded-xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <span className="relative flex items-center justify-center">
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <LogIn className="mr-2 h-4 w-4 animate-pulse-slow" />
            )}
            {isSignUp ? "Create Account" : "Sign In"}
          </span>
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-foreground/10"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthButton
          onClick={handleGoogleSignIn}
          icon={Globe}
          label="Google"
          className="border-love-200/50 dark:border-love-800/30 hover:border-love-400/50 dark:hover:border-love-600/30"
        />
        <AuthButton
          onClick={handleFacebookSignIn}
          icon={Facebook}
          label="Facebook"
          className="border-love-200/50 dark:border-love-800/30 hover:border-love-400/50 dark:hover:border-love-600/30"
        />
      </div>

      <div className="text-center pt-2">
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-muted-foreground hover:text-love-500 dark:hover:text-love-400 transition-colors"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </div>
  );
};
