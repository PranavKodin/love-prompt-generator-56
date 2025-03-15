
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Heart, Users, Calendar, BookOpen, Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar } from "@/components/ui/avatar";

export default function About() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    story: false,
    team: false,
    mission: false
  });
  
  const storyRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  
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
      
      checkSection(storyRef, 'story');
      checkSection(teamRef, 'team');
      checkSection(missionRef, 'mission');
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
  
  // Team members data
  const teamMembers = [
    {
      name: "Pranav Kumar",
      role: "Founder & CEO",
      bio: "Passionate about connecting hearts through technology. With over 10 years in AI development focused on emotional intelligence.",
      avatar: "https://i.pinimg.com/280x280_RS/00/1c/e2/001ce2cc08062ef80c000b7e0be2fdad.jpg",
      delay: 0,
    },
    {
      name: "Himanshu Singh",
      role: "Beta Tester",
      bio: "A vella who does nothing but is a good friend of the founder.",
      avatar: "https://i.pinimg.com/736x/a6/ba/ce/a6bacee47f5781ebcbac4ea8e1bf8078.jpg",
      delay: 100,
    },
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
                      <Heart size={14} className="mr-1.5 animate-pulse-slow" />
                      About Us
                      <Heart size={14} className="ml-1.5 animate-pulse-slow" style={{animationDelay: "1s"}} />
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-text-shimmer">
                    Our <span className="font-great-vibes text-5xl md:text-6xl lg:text-7xl gradient-text">Love Story</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    We're on a mission to help people express their feelings through the perfect words.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Our Story Section */}
            <section 
              id="story"
              ref={storyRef}
              className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 relative transition-all duration-1000",
                visibleSections.story ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={cn(
                    "bg-white/70 dark:bg-midnight-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-card order-2 lg:order-1",
                    visibleSections.story ? getResponsiveAnimation(
                      "animate-slide-in-mobile", 
                      "animate-fade-in-tablet", 
                      "animate-scale-in-desktop", 
                      "animate-blur-in-tv"
                    ) : ""
                  )}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-love-100 dark:bg-love-900/30 flex items-center justify-center mr-4">
                        <BookOpen className="h-6 w-6 text-love-600 dark:text-love-400" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">Our Journey</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mt-1 mr-4">
                          <div className="w-8 h-8 rounded-full bg-love-100 dark:bg-love-900/40 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-love-600 dark:text-love-400" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">2020: The Beginning</h3>
                          <p className="text-foreground/70">It all started with a simple idea: help people express their feelings through words. We realized how many struggle to find the right words for their loved ones.</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mt-1 mr-4">
                          <div className="w-8 h-8 rounded-full bg-love-100 dark:bg-love-900/40 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-love-600 dark:text-love-400" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">2024: AI Innovation</h3>
                          <p className="text-foreground/70">We developed our first AI model specifically designed to understand emotions and generate heartfelt expressions tailored to relationships.</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mt-1 mr-4">
                          <div className="w-8 h-8 rounded-full bg-love-100 dark:bg-love-900/40 flex items-center justify-center">
                            <Award className="h-4 w-4 text-love-600 dark:text-love-400" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">2025: Reaching Hearts</h3>
                          <p className="text-foreground/70">Today, we've have finally launched for people express their feelings, strengthening relationships and creating beautiful moments worldwide.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "relative order-1 lg:order-2 h-[400px] rounded-2xl overflow-hidden",
                    visibleSections.story ? getResponsiveAnimation(
                      "animate-slide-in-mobile", 
                      "animate-fade-in-tablet", 
                      "animate-scale-in-desktop", 
                      "animate-blur-in-tv"
                    ) : ""
                  )} style={{animationDelay: "200ms"}}>
                    <div className="absolute inset-0 bg-gradient-radial from-love-100/40 to-transparent dark:from-love-900/20 dark:to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="font-great-vibes text-6xl md:text-7xl lg:text-8xl gradient-text animate-text-shimmer">
                          Since 2024
                        </span>
                        <div className="mt-4 text-lg md:text-xl text-foreground/80">
                          Helping people express their love through words
                        </div>
                      </div>
                    </div>
                    {/* Floating hearts */}
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute text-love-400/30 dark:text-love-600/20"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          fontSize: `${Math.random() * 2 + 1}rem`,
                          animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 5}s`
                        }}
                      >
                        ❤
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Team Section */}
            <section 
              id="team"
              ref={teamRef}
              className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-midnight-900/20 dark:to-background relative transition-all duration-1000",
                visibleSections.team ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Users size={14} className="mr-1.5" />
                      Our Team
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer">
                    Meet the <span className="gradient-text">Hearts</span> Behind loverprompt
                  </h2>
                  <p className="text-foreground/70">
                    We're a passionate team of AI experts, relationship psychologists, and designers dedicated to helping people express their feelings.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-white/60 dark:bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-500",
                        "hover:transform hover:translate-y-[-5px] hover:border-love-200 dark:hover:border-love-800/30",
                        visibleSections.team ? getResponsiveAnimation(
                          "animate-slide-in-mobile", 
                          "animate-fade-in-tablet", 
                          "animate-scale-in-desktop", 
                          "animate-blur-in-tv"
                        ) : ""
                      )}
                      style={{ animationDelay: `${member.delay}ms` }}
                    >
                      <HoverCard>
                        <HoverCardTrigger>
                          <div className="flex flex-col items-center mb-4">
                            <Avatar className="w-24 h-24 border-4 border-love-100 dark:border-love-900/50">
                              <img src={member.avatar} alt={member.name} className="object-cover" />
                            </Avatar>
                            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
                            <p className="text-love-600 dark:text-love-400 text-sm">{member.role}</p>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="p-4 bg-white/90 dark:bg-midnight-900/90 backdrop-blur-md border border-love-100/50 dark:border-love-900/30 shadow-xl">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-foreground/80">{member.bio}</p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <p className="text-foreground/70 text-center text-sm">{member.bio.substring(0, 80)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Mission Section */}
            <section 
              id="mission"
              ref={missionRef}
              className={cn(
                "py-16 px-4 sm:px-6 lg:px-8 relative transition-all duration-1000",
                visibleSections.mission ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                  <div className={cn(
                    "bg-white/70 dark:bg-midnight-800/40 backdrop-blur-md rounded-2xl p-8 border border-white/40 dark:border-white/5 shadow-card",
                    visibleSections.mission ? getResponsiveAnimation(
                      "animate-slide-in-mobile", 
                      "animate-fade-in-tablet", 
                      "animate-scale-in-desktop", 
                      "animate-blur-in-tv"
                    ) : ""
                  )}>
                    <div className="text-center mb-8">
                      <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
                        <span className="text-sm font-medium text-love-600 dark:text-love-400">
                          Our Mission
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer">
                        Connecting <span className="gradient-text">Hearts</span> Through Words
                      </h2>
                    </div>
                    
                    <div className="space-y-6 text-lg">
                      <p>
                        At loverprompt, we believe that the right words can bridge hearts and strengthen bonds. Our mission is to help people express their deepest feelings when words fail them.
                      </p>
                      <p>
                        We understand that finding the perfect words to express love, appreciation, or admiration can be challenging. That's why we've developed an AI platform that helps you articulate your feelings in a way that feels authentic and meaningful.
                      </p>
                      <p>
                        Our technology is built with a deep understanding of human emotions and relationships, combining advanced AI with the nuance of human connection. We're not just about generating text – we're about helping you touch hearts.
                      </p>
                      <p className="font-medium text-love-600 dark:text-love-400 text-center italic mt-8">
                        "Words make you think. Music makes you feel. A song makes you feel a thought."
                        <span className="block text-sm mt-2 text-foreground/70">— E.Y. Harburg</span>
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
