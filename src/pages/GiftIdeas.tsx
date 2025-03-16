
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Search, Heart, Sparkles, Tag, Bookmark, ExternalLink } from "lucide-react";

export default function GiftIdeas() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Sample gift categories
  const categories = [
    "Anniversary", "Birthday", "Valentine's", "Just Because", 
    "Romance", "Experience", "Personalized", "Tech", "Fashion", "Handmade"
  ];
  
  // Sample gift ideas
  const [giftIdeas] = useState([
    {
      id: "1",
      title: "Custom Star Map",
      description: "A beautiful star map showing how the stars aligned on your special day.",
      price: "$40-60",
      category: "Personalized",
      tags: ["anniversary", "romantic", "personalized"],
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      saved: false
    },
    {
      id: "2",
      title: "Sunset Cruise Experience",
      description: "A romantic evening on the water watching the sunset together.",
      price: "$100-200",
      category: "Experience",
      tags: ["romantic", "adventure", "date-night"],
      imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      saved: true
    },
    {
      id: "3",
      title: "Personalized Love Letter Blanket",
      description: "A cozy blanket featuring your love letter or special message.",
      price: "$50-80",
      category: "Personalized",
      tags: ["cozy", "personalized", "practical"],
      imageUrl: "https://images.unsplash.com/photo-1517677752201-28a6a3312c27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      saved: false
    },
    {
      id: "4",
      title: "Cooking Class for Two",
      description: "Learn to cook a gourmet meal together with a professional chef.",
      price: "$80-150",
      category: "Experience",
      tags: ["cooking", "learning", "date-night"],
      imageUrl: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      saved: false
    },
    {
      id: "5",
      title: "Personalized Coordinates Bracelet",
      description: "A elegant bracelet featuring the coordinates of where you met.",
      price: "$30-70",
      category: "Jewelry",
      tags: ["jewelry", "personalized", "wearable"],
      imageUrl: "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      saved: true
    },
    {
      id: "6",
      title: "Love Language Book Set",
      description: "A collection of books about love languages to strengthen your relationship.",
      price: "$25-40",
      category: "Books",
      tags: ["reading", "relationship", "learning"],
      imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 4.4,
      saved: false
    }
  ]);

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
                      <Gift size={14} className="mr-1.5 animate-pulse-slow" />
                      New Feature
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
                    Personalized <span className="font-great-vibes text-5xl md:text-6xl gradient-text">Gift Ideas</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Discover the perfect gifts for your special someone, tailored to their interests and your relationship.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Search Section */}
            <section className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-md mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-center">Find the Perfect Gift</h2>
                  
                  <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-foreground/50" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search for gift ideas or describe your partner's interests..."
                      className="pl-10 py-6 rounded-xl border-love-200/50 dark:border-love-800/30 focus-visible:ring-love-400/30 dark:focus-visible:ring-love-600/30"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                      className="absolute right-1 top-1 bottom-1 bg-gradient-love hover:opacity-90 transition-opacity rounded-lg"
                    >
                      <Sparkles size={18} className="mr-2" />
                      Get AI Suggestions
                    </Button>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-foreground/70">Popular:</span>
                    {categories.map((category, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="rounded-full border-love-200/50 dark:border-love-800/30 hover:bg-love-50 dark:hover:bg-love-900/20 hover:text-love-600 dark:hover:text-love-400"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Gift ideas grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {giftIdeas.map((gift, index) => (
                    <div 
                      key={gift.id}
                      className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <img 
                          src={gift.imageUrl} 
                          alt={gift.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-2 right-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`rounded-full bg-white/80 dark:bg-midnight-800/80 backdrop-blur-sm ${gift.saved ? 'text-love-500 dark:text-love-400' : 'text-foreground/50'}`}
                          >
                            <Bookmark className="h-5 w-5" fill={gift.saved ? "currentColor" : "none"} />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-3 py-1 bg-love-100/80 dark:bg-love-900/80 text-love-700 dark:text-love-300 text-xs font-medium rounded-full backdrop-blur-sm">
                            {gift.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{gift.title}</h3>
                          <div className="flex items-center text-amber-500 dark:text-amber-400">
                            <Heart className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm">{gift.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-foreground/70 mb-3">{gift.description}</p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold">{gift.price}</span>
                          <div className="flex items-center space-x-1">
                            {gift.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" className="border-love-200/50 dark:border-love-800/30 hover:bg-love-50 dark:hover:bg-love-900/20 w-1/2 mr-2">
                            <Tag className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button className="bg-gradient-love hover:opacity-90 transition-opacity w-1/2">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Where to Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load more button */}
                <div className="mt-10 text-center">
                  <Button 
                    variant="outline" 
                    className="rounded-xl py-6 px-8 border-love-200/50 dark:border-love-800/30 hover:bg-love-50 dark:hover:bg-love-900/20"
                  >
                    Load More Gift Ideas
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
