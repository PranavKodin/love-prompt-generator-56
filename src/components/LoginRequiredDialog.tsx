import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

const LoginRequiredDialog: FC<LoginRequiredDialogProps> = ({
  open,
  onOpenChange,
  title = "Login Required",
  description = "You need to log in to use this feature.",
  icon: Icon
}) => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("/get-started");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-midnight-900/90 backdrop-blur-lg border border-love-200 dark:border-love-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold gradient-text">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          {Icon && (
            <div className="w-20 h-20 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center mb-4 animate-pulse">
              <Icon className="h-10 w-10 text-love-500 dark:text-love-400" />
            </div>
          )}
          
          <p className="text-center mb-4">
            Create an account to access all features of our application.
            <br />
            It only takes a moment to sign up!
          </p>
          
          <div className="flex gap-3 mt-2">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-love-200 dark:border-love-700"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={handleRedirectToLogin}
              className="bg-gradient-love hover:opacity-90 transition-all duration-300"
            >
              Log In / Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
