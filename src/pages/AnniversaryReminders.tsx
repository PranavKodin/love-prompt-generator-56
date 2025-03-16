
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, Plus, Heart, AlertCircle } from "lucide-react";

export default function AnniversaryReminders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Sample reminders
  const [reminders] = useState([
    {
      id: "1",
      title: "Relationship Anniversary",
      date: "2023-05-15",
      type: "anniversary",
      reminderDays: [1, 7, 30],
      notes: "Our first year together! Plan something special.",
      notificationMethod: ["app", "email"]
    },
    {
      id: "2",
      title: "Partner's Birthday",
      date: "2023-08-22",
      type: "birthday",
      reminderDays: [1, 7, 14],
      notes: "Remember to order the cake from that bakery they like.",
      notificationMethod: ["app", "email", "sms"]
    },
    {
      id: "3",
      title: "First Date Anniversary",
      date: "2023-03-10",
      type: "special",
      reminderDays: [1, 3],
      notes: "Maybe revisit the same restaurant?",
      notificationMethod: ["app"]
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
                      <Bell size={14} className="mr-1.5 animate-pulse-slow" />
                      New Feature
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
                    Anniversary <span className="font-great-vibes text-5xl md:text-6xl gradient-text">Reminders</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Never forget an important date again. Set up reminders for all your special occasions.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Add New Reminder Button */}
            <section className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-end mb-8">
                  <Button className="bg-gradient-love hover:opacity-90 transition-all duration-300 rounded-xl py-5 px-6">
                    <Plus size={18} className="mr-2" />
                    Add New Reminder
                  </Button>
                </div>
                
                {/* Upcoming reminder */}
                <div className="mb-12 bg-love-50/50 dark:bg-love-900/10 border border-love-200 dark:border-love-800/30 rounded-xl p-5 animate-pulse-slow">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-love-600 dark:text-love-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-love-800 dark:text-love-300">Upcoming: Partner's Birthday in 23 days</h3>
                      <p className="text-love-600/80 dark:text-love-400/80">
                        August 22, 2023 - Don't forget to prepare a special surprise!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Reminders grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reminders.map((reminder, index) => (
                    <div 
                      key={reminder.id}
                      className="bg-white/80 dark:bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center">
                            {reminder.type === "anniversary" ? (
                              <Heart className="h-5 w-5 text-love-600 dark:text-love-400" />
                            ) : reminder.type === "birthday" ? (
                              <Calendar className="h-5 w-5 text-love-600 dark:text-love-400" />
                            ) : (
                              <Bell className="h-5 w-5 text-love-600 dark:text-love-400" />
                            )}
                          </div>
                          <h3 className="ml-3 text-xl font-semibold">{reminder.title}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-foreground/70">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(reminder.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-foreground/70">
                          <Bell className="h-4 w-4 mr-2" />
                          <span>
                            Remind me: {reminder.reminderDays.map((day, i) => (
                              <span key={i}>
                                {day} {day === 1 ? 'day' : 'days'}
                                {i < reminder.reminderDays.length - 1 ? ', ' : ' before'}
                              </span>
                            ))}
                          </span>
                        </div>
                        
                        {reminder.notes && (
                          <p className="text-foreground/80 bg-foreground/5 p-3 rounded-lg text-sm italic">
                            {reminder.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-foreground/10 flex justify-between">
                        <div className="flex space-x-1">
                          {reminder.notificationMethod.map((method, i) => (
                            <span 
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-love-100/50 dark:bg-love-900/30 text-love-700 dark:text-love-300"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            Delete
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
