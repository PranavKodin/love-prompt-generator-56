
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Heart, Sparkles, MessageSquareHeart, Image as ImageIcon, PenLine, BrainCircuit, Settings, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Features() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    core: false,
    advanced: false,
    upcoming: false
  });
  
  const coreRef = useRef<HTMLElement>(null);
  const advancedRef = useRef<HTMLElement>(null);
  const upcomingRef = useRef<HTMLElement>(null);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      // Check if sections are in viewport
      const checkSection = (ref: React.RefObject<HTMLElement>, sectionId: string) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          
          setVisibleSections(prev => ({
            ...prev,
            [sectionId]: isVisible
          }));
        }
      };
      
      checkSection(coreRef, 'core');
      checkSection(advancedRef, 'advanced');
      checkSection(upcomingRef, 'upcoming');
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Define different animation classes for different screen sizes
  const getResponsiveAnimation = (isMobile: string, isTablet: string, isDesktop: string, isTV: string): string => {
    if (typeof window === 'undefined') return '';
    
    const width = window.innerWidth;
    if (width < 640) return isMobile; // Mobile
    if (width < 1024) return isTablet; // Tablet
    if (width < 1536) return isDesktop; // Desktop
    return isTV; // Large screens/TVs
  };
  
  // Features data
  const coreFeatures = [
    {
      icon: Heart,
      title: "Personalized Compliments",
      description: "Generate unique compliments tailored to your relationship and the specific traits you admire in your special someone.",
      color: "bg-love-100 dark:bg-love-900/30 text-love-600 dark:text-love-400"
    },
    {
      icon: Sparkles,
      title: "Multiple Styles",
      description: "Choose from romantic, poetic, humorous, sincere, and many other styles to match the tone you want to convey.",
      color: "bg-love-100 dark:bg-love-900/30 text-love-600 dark:text-love-400"
    },
    {
      icon: MessageSquareHeart,
      title: "Conversation Starters",
      description: "Get suggestions for meaningful conversation topics that can deepen your connection with your loved one.",
      color: "bg-love-100 dark:bg-love-900/30 text-love-600 dark:text-love-400"
    },
    {
      icon: ImageIcon,
      title: "Image Analysis",
      description: "Upload photos to help our AI understand the context and create more personalized compliments based on visual elements.",
      color: "bg-love-100 dark:bg-love-900/30 text-love-600 dark:text-love-400"
    }
  ];
  
  const advancedFeatures = [
    {
      icon: BrainCircuit,
      title: "Emotion Recognition",
      description: "Our advanced AI can detect subtle emotional nuances in your descriptions to generate truly heartfelt messages.",
      color: "bg-love-200 dark:bg-love-800/30 text-love-700 dark:text-love-300"
    },
    {
      icon: PenLine,
      title: "Custom Fine-tuning",
      description: "Adjust specific parameters to get the exact tone, length, and style of compliment you're looking for.",
      color: "bg-love-200 dark:bg-love-800/30 text-love-700 dark:text-love-300"
    },
    {
      icon: Settings,
      title: "Relationship Context",
      description: "Set your relationship type and history to ensure the AI generates appropriate and meaningful compliments.",
      color: "bg-love-200 dark:bg-love-800/30 text-love-700 dark:text-love-300"
    },
    {
      icon: Layers,
      title: "Multi-language Support",
      description: "Express your feelings in multiple languages with the same emotional resonance and personal touch.",
      color: "bg-love-200 dark:bg-love-800/30 text-love-700 dark:text-love-300"
    }
  ];
  
  const upcomingFeatures = [
    {
      title: "Voice Messages",
      description: "Soon you'll be able to turn your written compliments into beautifully spoken audio messages."
    },
    {
      title: "Relationship Journal",
      description: "Keep track of special moments and generate anniversary messages based on your shared experiences."
    },
    {
      title: "Gift Recommendations",
      description: "Get personalized gift ideas based on your descriptions of your special someone."
    },
    {
      title: "Couple's Quiz Creator",
      description: "Generate fun, personalized quizzes to help you learn more about each other."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1 pt-24">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="w-full">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-love-50/40 via-background to-background dark:from-midnight-900/20 dark:via-background dark:to-background z-0"></div>
              
              {/* Floating elements */}
              <div className="absolute top-1/4 right-1/5 w-64 h-64 rounded-full bg-love-200/20 dark:bg-love-800/10 blur-3xl animate-float opacity-70"></div>
              <div className="absolute bottom-1/3 left-1/5 w-56 h-56 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float opacity-60" style={{animationDelay: "2s"}}></div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4 animate-fade-in">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Sparkles size={14} className="mr-1.5 animate-pulse-slow" />
                      Features
                      <Sparkles size={14} className="ml-1.5 animate-pulse-slow" style={{animationDelay: "1s"}} />
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-text-shimmer">
                    Powerful <span className="font-great-vibes text-5xl md:text-6xl lg:text-7xl gradient-text">Features</span> to Express Your Love
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Discover all the ways loverprompt can help you create heartfelt expressions of love.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Core Features Section */}
            <section 
              id="core-features"
              ref={coreRef}
              className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 relative transition-all duration-1000",
                visibleSections.core ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Core Features
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer">
                    Everything You Need to Express Your Feelings
                  </h2>
                  <p className="text-foreground/70">
                    Our essential features make it easy to create authentic, heartfelt expressions of love.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {coreFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-white/60 dark:bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-500",
                        "hover:transform hover:translate-y-[-5px] hover:border-love-200 dark:hover:border-love-800/30",
                        visibleSections.core ? getResponsiveAnimation(
                          "animate-slide-in-mobile", 
                          "animate-fade-in-tablet", 
                          "animate-scale-in-desktop", 
                          "animate-blur-in-tv"
                        ) : ""
                      )}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.color)}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Advanced Features Section */}
            <section 
              id="advanced-features"
              ref={advancedRef}
              className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-midnight-900/20 dark:to-background relative transition-all duration-1000",
                visibleSections.advanced ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400">
                      Advanced Capabilities
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer">
                    For Those Who Want <span className="gradient-text">More</span>
                  </h2>
                  <p className="text-foreground/70">
                    Take your expressions of love to the next level with our advanced features.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {advancedFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-white/70 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-500",
                        "hover:transform hover:translate-y-[-5px] hover:border-love-200 dark:hover:border-love-800/30",
                        visibleSections.advanced ? getResponsiveAnimation(
                          "animate-slide-in-mobile", 
                          "animate-fade-in-tablet", 
                          "animate-scale-in-desktop", 
                          "animate-blur-in-tv"
                        ) : ""
                      )}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.color)}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Upcoming Features Section */}
            <section 
              id="upcoming-features"
              ref={upcomingRef}
              className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 relative transition-all duration-1000",
                visibleSections.upcoming ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Sparkles size={14} className="mr-1.5 animate-pulse-slow" />
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer">
                    The Future of <span className="gradient-text">Love Expression</span>
                  </h2>
                  <p className="text-foreground/70">
                    We're constantly developing new ways to help you connect with your loved ones.
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className={cn(
                    "bg-white/70 dark:bg-midnight-800/40 backdrop-blur-md rounded-2xl p-8 border border-white/40 dark:border-white/5 shadow-card",
                    visibleSections.upcoming ? getResponsiveAnimation(
                      "animate-slide-in-mobile", 
                      "animate-fade-in-tablet", 
                      "animate-scale-in-desktop", 
                      "animate-blur-in-tv"
                    ) : ""
                  )}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {upcomingFeatures.map((feature, index) => (
                        <div key={index} className="space-y-3" style={{ animationDelay: `${index * 150}ms` }}>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-love-100/80 dark:bg-love-900/40 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-love-600 dark:text-love-400" />
                            </div>
                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                          </div>
                          <p className="text-foreground/70 pl-10">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-10 text-center">
                      <p className="text-love-600 dark:text-love-400 italic">
                        "Love is not what you say, it's what you show."
                      </p>
                      <p className="text-foreground/60 text-sm mt-2">
                        We're always working on new ways to help you show your love.
                      </p>
                    </div>
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
