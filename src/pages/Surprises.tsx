
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, HeartHandshake, Calendar, Palette } from "lucide-react";

export default function Surprises() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample surprise ideas
  const surpriseIdeas = [
    {
      id: "1",
      title: "Romantic Dinner",
      description: "Book a table at their favorite restaurant or cook their favorite meal at home with candles and soft music.",
      category: "date",
      effort: "medium",
      costRange: "$-$$"
    },
    {
      id: "2",
      title: "Surprise Weekend Getaway",
      description: "Plan a short trip to somewhere they've mentioned wanting to visit. Pack their bags secretly and reveal the surprise at the last moment.",
      category: "adventure",
      effort: "high",
      costRange: "$$$"
    },
    {
      id: "3",
      title: "Memory Lane Slideshow",
      description: "Create a digital slideshow of your favorite moments together with a personalized soundtrack.",
      category: "sentimental",
      effort: "medium",
      costRange: "$"
    },
    {
      id: "4",
      title: "Breakfast in Bed",
      description: "Wake up early and prepare their favorite breakfast, complete with fresh flowers and a handwritten note.",
      category: "simple",
      effort: "low",
      costRange: "$"
    },
    {
      id: "5",
      title: "Surprise Picnic",
      description: "Pack a basket with their favorite foods and drinks and take them to a scenic location for an impromptu picnic.",
      category: "date",
      effort: "medium",
      costRange: "$"
    },
    {
      id: "6",
      title: "Love Scavenger Hunt",
      description: "Create clues that lead to meaningful places in your relationship, with a special gift at the end.",
      category: "adventure",
      effort: "high",
      costRange: "$$"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1 pt-24">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="w-full">
            {/* Header */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-love-50/40 via-background to-background dark:from-midnight-900/20 dark:via-background dark:to-background z-0"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/5 w-64 h-64 rounded-full bg-love-200/20 dark:bg-love-800/10 blur-3xl animate-float opacity-70"></div>
              <div className="absolute bottom-1/3 left-1/5 w-56 h-56 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float opacity-60" style={{animationDelay: "2s"}}></div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4 animate-fade-in">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Sparkles size={14} className="mr-1.5 animate-pulse-slow" />
                      Add Some Magic
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
                    Surprise <span className="font-great-vibes text-5xl md:text-6xl gradient-text">Suggestions</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Thoughtful surprise ideas to delight your partner and keep your relationship exciting.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Category Filter */}
            <section className="py-4 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  <Button variant="outline" className="rounded-full bg-love-50 dark:bg-love-900/10 border-love-200 dark:border-love-800/30 hover:bg-love-100 dark:hover:bg-love-800/20">
                    All Ideas
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Calendar size={16} className="mr-2" /> 
                    Date Night
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Gift size={16} className="mr-2" /> 
                    Gifts
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <HeartHandshake size={16} className="mr-2" /> 
                    Sentimental
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Palette size={16} className="mr-2" /> 
                    Creative
                  </Button>
                </div>
                
                {/* Surprise ideas grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {surpriseIdeas.map((idea, index) => (
                    <div 
                      key={idea.id}
                      className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{idea.title}</h3>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            idea.category === "date" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" :
                            idea.category === "adventure" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                            idea.category === "sentimental" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          }`}>
                            {idea.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-foreground/80 mb-4">
                        {idea.description}
                      </p>
                      
                      <div className="flex justify-between mt-4 pt-4 border-t border-foreground/10">
                        <div className="flex items-center">
                          <span className="text-xs font-medium mr-3">
                            Effort: 
                            <span className={`ml-1 ${
                              idea.effort === "low" ? "text-green-600 dark:text-green-400" :
                              idea.effort === "medium" ? "text-yellow-600 dark:text-yellow-400" :
                              "text-red-600 dark:text-red-400"
                            }`}>
                              {idea.effort}
                            </span>
                          </span>
                          <span className="text-xs font-medium">
                            Cost: {idea.costRange}
                          </span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-love-600 dark:text-love-400 hover:bg-love-50 dark:hover:bg-love-900/20">
                          Save idea
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Suggestion prompt */}
                <div className="mt-12 text-center">
                  <p className="text-foreground/70 mb-4">Don't see anything that fits? Let us help you create a custom surprise!</p>
                  <Button className="bg-gradient-love hover:opacity-90 transition-all duration-300 rounded-xl py-5 px-6">
                    <Sparkles size={18} className="mr-2" />
                    Generate Custom Surprise
                  </Button>
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
