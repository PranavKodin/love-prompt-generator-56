
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Heart, Image as ImageIcon, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RelationshipTimeline() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  // Demo timeline events
  const [events] = useState([
    {
      id: "1",
      title: "First Date",
      date: "2022-05-15",
      description: "We went to that little café by the park and talked for hours.",
      imageUrl: "https://images.unsplash.com/photo-1522264736803-3e3d83466d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      color: "bg-love-100 dark:bg-love-900/50",
      iconColor: "text-love-600 dark:text-love-400",
      borderColor: "border-love-200 dark:border-love-800/50"
    },
    {
      id: "2", 
      title: "Weekend Getaway",
      date: "2022-07-23",
      description: "Our first trip together to the mountains. The sunset views were unforgettable.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      color: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800/50"
    },
    {
      id: "3",
      title: "Anniversary Celebration",
      date: "2023-05-15",
      description: "One year together! We celebrated with a romantic dinner and reminisced about our journey so far.",
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      color: "bg-cyan-100 dark:bg-cyan-900/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      borderColor: "border-cyan-200 dark:border-cyan-800/50"
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1 pt-24">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="w-full">
            {/* Header */}
            <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-love-50/40 via-background to-background dark:from-midnight-900/20 dark:via-background dark:to-background z-0"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/5 w-64 h-64 rounded-full bg-love-200/20 dark:bg-love-800/10 blur-3xl animate-float opacity-70"></div>
              <div className="absolute bottom-1/3 left-1/5 w-56 h-56 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float opacity-60" style={{animationDelay: "2s"}}></div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4 animate-fade-in">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Users size={14} className="mr-1.5 animate-pulse-slow" />
                      New Feature
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
                    Your Relationship <span className="font-great-vibes text-5xl md:text-6xl gradient-text">Timeline</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Document your journey of love with a beautiful, interactive timeline of your special moments.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Timeline Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Add New Event Button */}
                  <div className="flex justify-center mb-12">
                    <Button className="bg-gradient-love hover:opacity-90 transition-all duration-300 rounded-xl py-6 px-8 shadow-lg hover:shadow-love-500/20">
                      <Plus size={18} className="mr-2" />
                      Add New Memory
                    </Button>
                  </div>
                  
                  {/* Timeline */}
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-love-200 via-love-300 to-love-200 dark:from-love-800/30 dark:via-love-700/30 dark:to-love-800/30 rounded-full opacity-70"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-16">
                      {events.map((event, index) => (
                        <div 
                          key={event.id}
                          className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-fade-in`}
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          {/* Timeline dot */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-love-500 dark:bg-love-600 z-10 shadow-glow-sm"></div>
                          
                          {/* Event card */}
                          <div className={cn(
                            "w-5/12 bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-5 border", 
                            event.borderColor,
                            "shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02]"
                          )}>
                            {event.imageUrl && (
                              <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                                <img 
                                  src={event.imageUrl} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center mb-3">
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", event.color)}>
                                <Heart className={cn("h-5 w-5", event.iconColor)} />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-xl font-bold">{event.title}</h3>
                                <div className="flex items-center text-sm text-foreground/60">
                                  <Calendar size={14} className="mr-1" />
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-foreground/80">{event.description}</p>
                          </div>
                          
                          {/* Spacer for opposite side */}
                          <div className="w-5/12"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Final dot */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-love-200 dark:bg-love-800/50 border-4 border-love-500 dark:border-love-600 z-10 animate-pulse-slow"></div>
                  </div>
                  
                  {/* Add another memory button at bottom */}
                  <div className="mt-16 text-center">
                    <p className="text-foreground/70 mb-4">Your story is just beginning. Add more memories to your timeline!</p>
                    <Button className="bg-white/80 dark:bg-midnight-800/50 text-love-600 dark:text-love-400 hover:bg-love-50 dark:hover:bg-love-900/20 border border-love-200 dark:border-love-800/50 rounded-xl py-5 px-8">
                      <Plus size={18} className="mr-2" />
                      Add Another Memory
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Coming Soon Features */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-love-50/30 to-background dark:from-background dark:via-love-900/5 dark:to-background">
              <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">More Timeline Features Coming Soon</h2>
                  <p className="text-foreground/70">
                    We're working on exciting new ways to enhance your relationship timeline.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    {
                      icon: ImageIcon,
                      title: "Photo Galleries",
                      description: "Add multiple photos to each memory to create beautiful galleries."
                    },
                    {
                      icon: Clock,
                      title: "Memory Reminders",
                      description: "Get reminded of special moments on their anniversaries."
                    },
                    {
                      icon: Users,
                      title: "Shared Timelines",
                      description: "Invite your partner to contribute to a shared relationship timeline."
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm transition-all duration-500"
                    >
                      <div className="w-12 h-12 rounded-xl bg-love-100 dark:bg-love-900/30 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-love-600 dark:text-love-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
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
