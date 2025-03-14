import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      toast.success("Thank you for subscribing! We'll notify you when we launch.");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />

      <Navbar toggleSidebar={() => {}} />

      <main className="flex-1 container max-w-3xl mx-auto pt-28 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Love Stories</h1>
          <div className="flex justify-center mb-6">
            <Heart className="size-12 text-love-500 animate-pulse" />
          </div>
          <p className="text-xl text-foreground/80 mb-6">
            Share your beautiful love stories with the world
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Coming Soon
          </h2>
          <p className="text-foreground/70 max-w-md mx-auto">
            We're putting the finishing touches on our love stories platform. 
            Subscribe to be notified when we launch.
          </p>
        </div>

        <Card className="w-full max-w-md backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30">
          <CardHeader className="text-center">
            <h3 className="font-medium">Get Notified When We Launch</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-love" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Notify Me"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 w-full flex justify-center">
          <div className="animate-bounce flex items-center gap-2 text-love-500 dark:text-love-400">
            <span>Launching Soon</span>
            <div className="flex gap-1">
              <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-love-500 opacity-75 delay-0"></span>
              <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-love-500 opacity-75 delay-100"></span>
              <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-love-500 opacity-75 delay-200"></span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="size-8 text-love-500" />
            </div>
            <h3 className="font-medium mb-2">Share Your Story</h3>
            <p className="text-sm text-foreground/70">
              Share your unique love story with our community
            </p>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="size-8 text-love-500 fill-love-500" />
            </div>
            <h3 className="font-medium mb-2">Connect</h3>
            <p className="text-sm text-foreground/70">
              Comment, like, and connect with other love stories
            </p>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="size-8 text-love-500" />
            </div>
            <h3 className="font-medium mb-2">Get Inspired</h3>
            <p className="text-sm text-foreground/70">
              Find inspiration from beautiful stories of love
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;