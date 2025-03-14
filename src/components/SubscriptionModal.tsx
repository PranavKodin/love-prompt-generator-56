
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/context/UserContext";
import { Heart, Lock, X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { upgradeSubscription } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  
  useEffect(() => {
    if (isOpen) {
      setStep('info');
      setFormData({
        name: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
      });
    }
  }, [isOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (step === 'info') {
      setStep('payment');
      return;
    }
    
    if (step === 'payment') {
      setLoading(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false);
        setStep('confirmation');
      }, 1500);
      
      return;
    }
    
    if (step === 'confirmation') {
      await upgradeSubscription();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-midnight-900/90 backdrop-blur-lg border border-white/20 dark:border-midnight-800/30 shadow-xl rounded-2xl">
        <DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full hover:bg-love-100/50 dark:hover:bg-love-900/30 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-12 h-12 bg-love-100/50 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-love-600 dark:text-love-400" />
          </div>
          
          <DialogTitle className="text-xl text-center gradient-text">
            {step === 'info' && 'Upgrade to Premium'}
            {step === 'payment' && 'Payment Details'}
            {step === 'confirmation' && 'Welcome to Premium!'}
          </DialogTitle>
          
          <DialogDescription className="text-center">
            {step === 'info' && 'Unlock all premium features for just ₹99 per year.'}
            {step === 'payment' && 'Enter your payment information to continue.'}
            {step === 'confirmation' && 'Your premium subscription is now active.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'info' && (
          <div className="space-y-4 py-2">
            <div className="bg-gradient-to-r from-love-50 to-love-100 dark:from-love-900/20 dark:to-love-800/20 p-4 rounded-xl">
              <p className="text-2xl font-bold text-center mb-2">₹99 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-love-600 dark:text-love-400 mr-2 fill-current" />
                  <span>Unlimited saved compliments</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-love-600 dark:text-love-400 mr-2 fill-current" />
                  <span>Advanced customization options</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-love-600 dark:text-love-400 mr-2 fill-current" />
                  <span>Priority compliment generation</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-love-600 dark:text-love-400 mr-2 fill-current" />
                  <span>Ad-free experience</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 'payment' && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter cardholder name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                />
              </div>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Lock className="h-3 w-3 mr-1" />
              Your payment information is secured with 256-bit encryption
            </div>
          </div>
        )}
        
        {step === 'confirmation' && (
          <div className="py-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-love-100/50 dark:bg-love-900/30 rounded-full flex items-center justify-center animate-pulse-slow">
                <Heart className="h-8 w-8 text-love-600 dark:text-love-400 fill-current" />
              </div>
            </div>
            
            <p className="mb-2">Thank you for upgrading to Premium!</p>
            <p className="text-muted-foreground text-sm mb-4">
              Your subscription is now active and will renew automatically in one year.
            </p>
          </div>
        )}

        <DialogFooter>
          {step === 'info' && (
            <Button
              className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300"
              onClick={handleSubmit}
            >
              Continue to Payment
            </Button>
          )}
          
          {step === 'payment' && (
            <Button
              className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Pay ₹99'
              )}
            </Button>
          )}
          
          {step === 'confirmation' && (
            <Button
              className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300"
              onClick={handleSubmit}
            >
              Start Enjoying Premium
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
