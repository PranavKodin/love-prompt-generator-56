
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Medal, Heart, Calendar, Trophy, CheckCircle2, Clock, Filter } from "lucide-react";

export default function RelationshipChallenges() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Sample challenges
  const [challenges] = useState([
    {
      id: "1",
      title: "30 Days of Appreciation",
      description: "Each day, express one thing you appreciate about your partner in a creative way.",
      category: "Communication",
      difficulty: "Medium",
      duration: "30 days",
      status: "active",
      progress: 12,
      imageUrl: "https://images.unsplash.com/photo-1522057384800-19adbc40c7e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "2",
      title: "The Question Game",
      description: "Take turns asking each other one deep question each day to learn more about each other.",
      category: "Connection",
      difficulty: "Easy",
      duration: "7 days",
      status: "completed",
      progress: 7,
      imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "3",
      title: "Digital Detox Weekend",
      description: "Spend a full weekend without phones or screens, focusing only on each other.",
      category: "Quality Time",
      difficulty: "Hard",
      duration: "2 days",
      status: "upcoming",
      progress: 0,
      imageUrl: "https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "4",
      title: "Surprise Date Planning",
      description: "Take turns planning surprise dates for each other every week for a month.",
      category: "Romance",
      difficulty: "Medium",
      duration: "4 weeks",
      status: "upcoming",
      progress: 0,
      imageUrl: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "5",
      title: "Gratitude Journal",
      description: "Keep a shared gratitude journal where you both write one thing you're grateful for about your relationship each day.",
      category: "Mindfulness",
      difficulty: "Easy",
      duration: "14 days",
      status: "active",
      progress: 5,
      imageUrl: "https://images.unsplash.com/photo-1492618269284-653dce58fd5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "6",
      title: "New Experience Every Month",
      description: "Try one completely new experience together each month for a year.",
      category: "Adventure",
      difficulty: "Medium",
      duration: "12 months",
      status: "active",
      progress: 3,
      imageUrl: "https://images.unsplash.com/photo-1476490372105-7d91f103a6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    }
  ]);

  const filteredChallenges = activeFilter === "all" 
    ? challenges 
    : challenges.filter(challenge => challenge.status === activeFilter);

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
                      <Medal size={14} className="mr-1.5 animate-pulse-slow" />
                      New Feature
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
                    Relationship <span className="font-great-vibes text-5xl md:text-6xl gradient-text">Challenges</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Strengthen your bond with fun challenges designed to deepen your connection and enhance communication.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Challenge Stats */}
            <section className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/40 dark:border-white/5 shadow-sm flex items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-foreground/70 text-sm">Total Challenges</p>
                      <h3 className="text-2xl font-bold">{challenges.length}</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/40 dark:border-white/5 shadow-sm flex items-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-foreground/70 text-sm">Active Challenges</p>
                      <h3 className="text-2xl font-bold">{challenges.filter(c => c.status === 'active').length}</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/40 dark:border-white/5 shadow-sm flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-foreground/70 text-sm">Completed</p>
                      <h3 className="text-2xl font-bold">{challenges.filter(c => c.status === 'completed').length}</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/40 dark:border-white/5 shadow-sm flex items-center">
                    <div className="w-12 h-12 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-love-600 dark:text-love-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-foreground/70 text-sm">Upcoming</p>
                      <h3 className="text-2xl font-bold">{challenges.filter(c => c.status === 'upcoming').length}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Filter and Add New */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <Filter className="h-5 w-5 text-foreground/70" />
                    <div className="flex space-x-2">
                      {["all", "active", "completed", "upcoming"].map((filter) => (
                        <Button
                          key={filter}
                          variant={activeFilter === filter ? "default" : "outline"}
                          size="sm"
                          className={activeFilter === filter 
                            ? "bg-love-500 hover:bg-love-600 text-white" 
                            : "border-love-200/50 dark:border-love-800/30 hover:bg-love-50 dark:hover:bg-love-900/20"}
                          onClick={() => setActiveFilter(filter)}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-love hover:opacity-90 transition-all duration-300 rounded-xl py-5 px-6">
                    <Medal size={18} className="mr-2" />
                    Start New Challenge
                  </Button>
                </div>
                
                {/* Challenges grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChallenges.map((challenge, index) => (
                    <div 
                      key={challenge.id}
                      className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <img 
                          src={challenge.imageUrl} 
                          alt={challenge.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                              ${challenge.status === 'active' ? 'bg-cyan-100/80 text-cyan-700 dark:bg-cyan-900/80 dark:text-cyan-300' : 
                                challenge.status === 'completed' ? 'bg-green-100/80 text-green-700 dark:bg-green-900/80 dark:text-green-300' : 
                                'bg-love-100/80 text-love-700 dark:bg-love-900/80 dark:text-love-300'} 
                              backdrop-blur-sm`}
                            >
                              {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                            </span>
                            <span className="px-3 py-1 bg-white/80 dark:bg-midnight-800/80 text-foreground/80 text-xs font-medium rounded-full backdrop-blur-sm">
                              {challenge.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                        <p className="text-foreground/70 mb-4">{challenge.description}</p>
                        
                        {challenge.status === 'active' && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-foreground/70">Progress</span>
                              <span className="text-sm font-semibold">{challenge.progress}/{challenge.duration.split(' ')[0]}</span>
                            </div>
                            <div className="w-full bg-foreground/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-love h-2 rounded-full" 
                                style={{ width: `${(challenge.progress / parseInt(challenge.duration)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-foreground/10 text-foreground/70 text-xs rounded-full">
                              {challenge.category}
                            </span>
                            <span className="px-2 py-1 bg-foreground/10 text-foreground/70 text-xs rounded-full">
                              {challenge.difficulty}
                            </span>
                          </div>
                          
                          <Button 
                            className={challenge.status === 'completed' 
                              ? "bg-green-500 hover:bg-green-600 cursor-default" 
                              : challenge.status === 'active'
                              ? "bg-gradient-love hover:opacity-90"
                              : "bg-love-500 hover:bg-love-600"}
                          >
                            {challenge.status === 'completed' 
                              ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Completed</>
                              : challenge.status === 'active'
                              ? <><Heart className="h-4 w-4 mr-2" /> Continue</>
                              : <><Calendar className="h-4 w-4 mr-2" /> Start</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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
