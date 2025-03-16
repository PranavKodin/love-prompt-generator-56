
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CalendarIcon, MapPin, ArrowLeft, User as UserIcon, Heart, Bookmark, History, Edit, Shield, Cake } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getUserById } from "@/lib/firebase";
import { TimelineEvent, getPublicTimelineEvents } from "@/lib/timelineService";
import { Timestamp } from "@/lib/firebase";

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt?: Timestamp;
  bio?: string;
  location?: string;
  interests?: string[];
  birthdate?: Timestamp;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    if (userId) {
      loadUserData();
      loadTimelineEvents();
    }
  }, [userId]);
  
  const loadUserData = async () => {
    if (!userId) return;
    
    try {
      const fetchedUser = await getUserById(userId);
      
      if (fetchedUser) {
        setUserData(fetchedUser as UserData);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found"
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user profile"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadTimelineEvents = async () => {
    if (!userId) return;
    
    try {
      const events = await getPublicTimelineEvents(userId);
      setTimelineEvents(events);
    } catch (error) {
      console.error("Error loading timeline events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load timeline events"
      });
    }
  };
  
  // Format the initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <UserIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground mb-6">The user profile you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/public-compliments" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Public Compliments
        </Link>
        <h1 className="text-3xl font-bold gradient-text">{userData.displayName}'s Profile</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={userData.photoURL} alt={userData.displayName} />
                <AvatarFallback className="text-2xl">
                  {userData.displayName ? getInitials(userData.displayName) : "?"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{userData.displayName}</CardTitle>
              {userData.location && (
                <CardDescription className="flex items-center justify-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {userData.location}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="text-center">
              {userData.bio ? (
                <p className="text-sm mb-4">{userData.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic mb-4">No bio provided</p>
              )}
              
              {userData.createdAt && (
                <div className="flex items-center justify-center text-xs text-muted-foreground mb-2">
                  <UserIcon className="h-3 w-3 mr-1" />
                  Member since {format(userData.createdAt.toDate(), "MMMM yyyy")}
                </div>
              )}
              
              {userData.birthdate && (
                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  <Cake className="h-3 w-3 mr-1" />
                  Birthday: {format(userData.birthdate.toDate(), "MMMM d")}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {userId === user?.uid ? (
                <Button asChild variant="outline">
                  <Link to="/profile">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit My Profile
                  </Link>
                </Button>
              ) : (
                <Button 
                  className="bg-gradient-love hover:opacity-90 transition-opacity"
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "Following other users will be available soon!"
                    });
                  }}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Follow
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {userData.interests && userData.interests.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-muted rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:w-2/3 lg:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="timeline">Public Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" />
                    About {userData.displayName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.bio ? (
                    <p>{userData.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No biography provided</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Heart className="mr-2 h-4 w-4 text-love-500" />
                      Relationship Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">Not shared</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Bookmark className="mr-2 h-4 w-4 text-amber-500" />
                      Public Compliments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <Link to="/public-compliments" className="text-love-600 dark:text-love-400 hover:underline">
                        View {userData.displayName}'s public compliments
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline">
              {timelineEvents.length === 0 ? (
                <div className="text-center p-10 border border-dashed rounded-lg">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No public timeline events</h3>
                  <p className="text-muted-foreground">
                    {userId === user?.uid 
                      ? "You haven't made any timeline events public yet."
                      : `${userData.displayName} hasn't shared any public timeline events yet.`
                    }
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border dark:bg-muted z-0" />
                  
                  <div className="relative z-10 space-y-8">
                    {timelineEvents.map((event, index) => {
                      const isEven = index % 2 === 0;
                      const eventDate = event.date instanceof Timestamp ? 
                        event.date.toDate() : new Date(event.date);
                      
                      return (
                        <div key={event.id} className="flex items-center justify-center">
                          <div 
                            className={cn(
                              "w-full md:w-5/12 p-1",
                              isEven ? "md:mr-auto" : "md:ml-auto"
                            )}
                          >
                            <Card className={cn(
                              "w-full transition-all hover:shadow-md overflow-hidden",
                              isEven ? "md:rounded-tr-3xl" : "md:rounded-tl-3xl"
                            )}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {format(eventDate, "MMMM d, yyyy")}
                                  
                                  {event.location && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </>
                                  )}
                                </CardDescription>
                              </CardHeader>
                              
                              {event.imageUrl && (
                                <div className="px-6">
                                  <div className="w-full h-48 rounded-md overflow-hidden">
                                    <img 
                                      src={event.imageUrl} 
                                      alt={event.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <CardContent>
                                <p className="whitespace-pre-wrap">{event.description}</p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Timeline dot */}
                          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-love-500 border-2 border-background"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
