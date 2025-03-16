
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Calendar, User, MapPin } from "lucide-react";
import { getUserProfile, getTimelineEvents } from "@/lib/firebase";
import { UserProfile as UserProfileType, TimelineEvent } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile(userId);
        if (!userProfile) {
          toast({
            variant: "destructive",
            title: "User not found",
            description: "The requested user profile could not be found.",
          });
          navigate("/");
          return;
        }
        setProfile(userProfile);

        // Fetch user's timeline events
        const events = await getTimelineEvents(userId);
        setTimelineEvents(events);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, navigate, toast]);

  const getUserInitials = (name?: string) => {
    if (!name) return "U";

    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="animate-spin h-8 w-8 border-4 border-love-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-foreground/70">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-6 transition-colors animate-fade-in">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>

          {profile && (
            <Card className="glass overflow-hidden animate-scale-in">
              <div className="h-40 bg-gradient-love relative"></div>

              <div className="px-6 sm:px-10">
                <div className="relative -mt-16 flex justify-center sm:justify-start">
                  <Avatar className="h-28 w-28 ring-4 ring-background border-2 border-love-400">
                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                    <AvatarFallback className="bg-gradient-love text-white text-xl">
                      {getUserInitials(profile.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <CardHeader className="pt-5 pb-0 px-0">
                  <CardTitle className="font-playfair text-2xl md:text-3xl gradient-text">
                    {profile.displayName}
                  </CardTitle>

                  <CardDescription className="flex items-center mt-1 text-muted-foreground">
                    <User className="mr-1 h-3 w-3" />
                    {profile.email}
                  </CardDescription>

                  {profile.location && (
                    <CardDescription className="flex items-center mt-1 text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {profile.location}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="px-0 py-5">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">About</h3>
                    <p className="text-foreground/80">
                      {profile.bio || "No bio yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl">
                      <h3 className="text-sm font-semibold text-love-600 dark:text-love-400 mb-1">Member Since</h3>
                      <p className="text-foreground/80">
                        {profile.createdAt && new Date(profile.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Timeline Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">Relationship Timeline</h2>
            
            {timelineEvents.length === 0 ? (
              <div className="text-center py-12 bg-white/50 dark:bg-midnight-800/30 rounded-xl">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground/70">This user hasn't shared any timeline events yet.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-love-200 via-love-300 to-love-200 dark:from-love-800/30 dark:via-love-700/30 dark:to-love-800/30 rounded-full opacity-70"></div>
                
                {/* Timeline events */}
                <div className="space-y-16">
                  {timelineEvents.map((event, index) => (
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
                        event.borderColor || "border-love-200 dark:border-love-800/50",
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
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", event.color || "bg-love-100 dark:bg-love-900/50")}>
                            <Calendar className={cn("h-5 w-5", event.iconColor || "text-love-600 dark:text-love-400")} />
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
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
