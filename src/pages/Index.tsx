
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/Hero";
import { CustomizationForm } from "@/components/CustomizationForm";
import { Footer } from "@/components/Footer";
import { Heart, Upload, Sliders, Sparkles, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function Index() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="w-full">
            {/* Hero Section */}
            <Hero />
            
            {/* Features Section */}
            <section 
              id="features" 
              className={cn(
                "py-24 px-4 relative overflow-hidden transition-opacity duration-1000",
                scrollY > 200 ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute inset-0 bg-gradient-radial from-love-50/30 to-transparent dark:from-love-900/10 dark:to-transparent opacity-60 pointer-events-none"></div>
              
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
                  <div className="inline-block rounded-full bg-love-100/50 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Sparkles size={14} className="mr-1.5 animate-pulse-slow" />
                      Features
                      <Sparkles size={14} className="ml-1.5 animate-pulse-slow" style={{animationDelay: "1s"}} />
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Create the Perfect Compliment in Seconds</h2>
                  <p className="text-foreground/70">
                    Our AI-powered platform helps you craft personalized, heartfelt compliments for your special someone.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 xl:gap-8">
                  {[
                    {
                      icon: Heart,
                      title: "Personalized Compliments",
                      description: "Create unique compliments tailored to your special someone's personality and your relationship."
                    },
                    {
                      icon: Sliders,
                      title: "Customizable Options",
                      description: "Choose from various styles, tones, and moods to craft the perfect compliment for any occasion."
                    },
                    {
                      icon: Upload,
                      title: "Image Upload",
                      description: "Upload a photo to help our AI create more personalized and relevant compliments."
                    },
                    {
                      icon: Sparkles,
                      title: "Advanced AI",
                      description: "Powered by state-of-the-art language models to create natural, heartfelt compliments."
                    },
                    {
                      icon: MessageSquareHeart,
                      title: "Conversation Starters",
                      description: "Get suggestions for starting meaningful conversations with your special someone."
                    },
                    {
                      icon: Heart,
                      title: "Romantic Ideas",
                      description: "Receive creative and romantic ideas to express your feelings beyond just words."
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-white/60 dark:bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-500 animate-fade-in",
                        "hover:transform hover:translate-y-[-5px] hover:border-love-200 dark:hover:border-love-800/30"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-love-100 dark:bg-love-900/30 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-love-600 dark:text-love-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Advanced Customization Section */}
            <section 
              id="customize" 
              className={cn(
                "py-24 px-4 bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-midnight-900/20 dark:to-background relative overflow-hidden transition-opacity duration-1000",
                scrollY > 600 ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-love-200/20 dark:bg-love-800/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-love-300/20 dark:bg-love-700/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3"></div>
              </div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Advanced Customization
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Fine-tune Your Compliment Prompts</h2>
                  <p className="text-foreground/70">
                    Create perfectly crafted compliment prompts with our advanced customization options.
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto animate-scale-in">
                  <div className="bg-white/70 dark:bg-midnight-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-card hover:shadow-card-hover transition-all duration-500">
                    <CustomizationForm />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Enhanced Contact Section */}
            <section 
              id="contact" 
              className={cn(
                "py-24 px-4 relative overflow-hidden transition-opacity duration-1000",
                scrollY > 1000 ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-love-50/30 via-background to-love-50/20 dark:from-love-900/10 dark:via-background dark:to-love-900/5"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-love-200/20 dark:bg-love-800/10 blur-3xl"></div>
              <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-love-300/20 dark:bg-love-700/10 blur-3xl"></div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Heart size={14} className="mr-1.5 animate-pulse-slow" />
                      Get in Touch
                      <Heart size={14} className="ml-1.5 animate-pulse-slow" style={{animationDelay: "1s"}} />
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your Love Story With Us</h2>
                  <p className="text-foreground/70">
                    Have questions, feedback, or a beautiful love story to share? We'd love to hear from you!
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto animate-scale-in">
                  <div className="bg-white/70 dark:bg-midnight-800/40 backdrop-blur-md rounded-2xl p-8 border border-white/40 dark:border-white/5 shadow-card">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium flex items-center">
                            <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                            Your Name
                          </label>
                          <Input
                            id="name"
                            type="text"
                            className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium flex items-center">
                            <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium flex items-center">
                          <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                          Subject
                        </label>
                        <Input
                          id="subject"
                          type="text"
                          className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30"
                          placeholder="What's on your mind?"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium flex items-center">
                          <Heart size={12} className="mr-1.5 text-love-500 dark:text-love-400" />
                          Your Message
                        </label>
                        <Textarea
                          id="message"
                          rows={5}
                          className="rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30 bg-white/50 dark:bg-midnight-700/30 resize-none"
                          placeholder="Share your thoughts, questions, or your love story..."
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow rounded-xl py-6"
                      >
                        <Heart size={18} className="mr-2 animate-pulse-slow" />
                        Send Message
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
