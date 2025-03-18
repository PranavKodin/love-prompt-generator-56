import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  CalendarIcon,
  MapPin,
  ArrowLeft,
  User as UserIcon,
  Heart,
  Bookmark,
  Edit,
  Cake,
  UserPlus,
  UserCheck,
  UserX,
  Users,
  Star,
  ExternalLink,
  Sparkles,
  BookOpen,
  Mail,
  Globe,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getUserProfile,
  Timestamp,
  isFollowing,
  followUser,
  unfollowUser,
  getFollowCounts,
  getFollowers,
  getFollowing,
  UserProfile as UserProfileType
} from "@/lib/firebase";
import { getPublicTimelineEvents, TimelineEvent } from "@/lib/timelineService";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserData {
  uid: string;
  displayName: string;
  bannerURL?: string;
  email: string;
  photoURL: string;
  createdAt?: Timestamp;
  bio?: string;
  location?: string;
  interests?: string[];
  birthdate?: Timestamp;
  followersCount?: number;
  followingCount?: number;
  isPrivate?: boolean;
  subscription?: {
    level: "free" | "premium";
    expiresAt: Timestamp;
  };
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"followers" | "following">("followers");
  const [followUsers, setFollowUsers] = useState<UserProfileType[]>([]);
  const [loadingFollowUsers, setLoadingFollowUsers] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserData();
      loadTimelineEvents();
      loadFollowStatus();
      loadFollowCounts();
    }
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;

    try {
      const fetchedUser = await getUserProfile(userId);

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

  const loadFollowStatus = async () => {
    if (!userId || !user) return;

    try {
      const following = await isFollowing(user.uid, userId);
      setIsUserFollowing(following);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const loadFollowCounts = async () => {
    if (!userId) return;

    try {
      const counts = await getFollowCounts(userId);
      setFollowCounts(counts);
    } catch (error) {
      console.error("Error loading follow counts:", error);
    }
  };

  const handleFollow = async () => {
    if (!userId || !user) return;

    setFollowLoading(true);
    try {
      if (isUserFollowing) {
        await unfollowUser(user.uid, userId);
        setIsUserFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${userData?.displayName}`
        });
      } else {
        await followUser(user.uid, userId);
        setIsUserFollowing(true);
        toast({
          title: "Following",
          description: `You are now following ${userData?.displayName}`
        });
      }
      // Refresh follow counts
      loadFollowCounts();
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status"
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const openFollowDialog = async (type: "followers" | "following") => {
    if (!userId) return;

    setDialogType(type);
    setFollowDialogOpen(true);
    setLoadingFollowUsers(true);

    try {
      let users: UserProfileType[] = [];

      if (type === "followers") {
        users = await getFollowers(userId);
      } else {
        users = await getFollowing(userId);
      }

      setFollowUsers(users);

      if (users.length === 0) {
        toast({
          title: "No users found",
          description: `This user doesn't have any ${type} yet.`,
        });
      }
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load ${type}`
      });
    } finally {
      setLoadingFollowUsers(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const isPremium = useMemo(() => {
    return userData?.subscription?.level === "premium";
  }, [userData]);

  const renderBanner = () => {
    if (!userData?.bannerURL || userData.bannerURL === "gradient") {
      return <div className="relative h-32 md:h-48 bg-gradient-love">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 dark:from-white/5 dark:to-black/30"></div>
      </div>;
    }

    return (
      <div className="relative h-32 md:h-48 overflow-hidden">
        <img
          src={userData.bannerURL}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="rounded-full bg-muted w-20 h-20 mx-auto flex items-center justify-center mb-6 animate-bounce">
            <UserIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-8">The user profile you're looking for doesn't exist or has been removed.</p>
          <Button asChild size="lg" className="animate-fade-in">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen to-muted/30 pt-8 px-4">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />
      <div className="container mx-auto max-w-6xl">
        {/* Header with back button */}
        <div className="mb-6 animate-fade-in-tablet">
          <Link to="/public-compliments" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Public Compliments
          </Link>
        </div>

        {/* Profile Header - Hero Section */}
        {/* Removed the bg-gradient-love class and p-1 padding that was creating the pink background */}
        <Card className="glass mb-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow animate-scale-in">
          <div className="bg-card rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              {renderBanner()}
              {/* Fixed gradient fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute inset-0 bg-card opacity-5" />
              </div>
            </div>
            <div className="px-4 md:px-8 relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end pb-4 gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-card shadow-xl animate-float">
                <AvatarImage src={userData?.photoURL} alt={userData?.displayName} className="object-cover" />
                <AvatarFallback className="text-3xl">
                  {userData?.displayName ? getInitials(userData.displayName) : "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 pb-2 pt-4 md:pt-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 animate-text-fade">
                    {userData?.displayName}
                    {isPremium && (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse" />
                    )}
                  </h1>

                  {userData?.location && (
                    <div className="flex items-center text-sm text-muted-foreground animate-text-slide">
                      <MapPin className="h-4 w-4 mr-1 text-love-500" />
                      {userData.location}
                    </div>
                  )}
                </div>

                {userData?.bio && (
                  <p className="mt-2 text-muted-foreground max-w-xl animate-text-scale">
                    {userData.bio}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all animate-fade-in"
                    onClick={() => openFollowDialog("followers")}
                  >
                    <span className="font-semibold mr-1">{followCounts.followers}</span> Followers
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all animate-fade-in delay-100"
                    onClick={() => openFollowDialog("following")}
                  >
                    <span className="font-semibold mr-1">{followCounts.following}</span> Following
                  </Button>

                  {userData?.createdAt && (
                    <div className="text-xs text-muted-foreground flex items-center animate-fade-in delay-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Joined {format(userData.createdAt.toDate(), "MMMM yyyy")}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 md:mt-0 animate-fade-in delay-300">
                {userId === user?.uid ? (
                  <Button asChild variant="outline" className="w-full md:w-auto hover:scale-105 transition-transform">
                    <Link to="/profile">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className={cn(
                      "w-full md:w-auto transition-all duration-300 hover:shadow-lg",
                      isUserFollowing
                        ? "bg-muted hover:bg-muted/90"
                        : "bg-love-500 hover:bg-love-600 text-white"
                    )}
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {isUserFollowing ? (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* User Stats Card */}
            <Card className="glass overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-background to-muted/30 pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-love-500" />
                  Stats & Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {userData.birthdate && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center text-love-500">
                        <Cake className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Birthday</div>
                        <div>{format(userData.birthdate.toDate(), "MMMM d")}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center text-love-500">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Public Compliments</div>
                      <Link to="/public-compliments" className="text-love-600 hover:underline dark:text-love-400">
                        View their compliments
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-love-100 dark:bg-love-900/30 flex items-center justify-center text-love-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Contact</div>
                      <div>Private messaging coming soon</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests Card */}
            {userData.interests && userData.interests.length > 0 && (
              <Card className="glass overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-scale-in">
                <CardHeader className="bg-gradient-to-r from-background to-muted/30 pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-love-500" />
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {userData.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-muted/50 hover:bg-muted transition-colors cursor-default animate-fade-in"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Tabs */}
          <div className="md:col-span-2">
            <Card className="glass overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-scale-in">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none bg-transparent border-b h-auto p-0">
                    <TabsTrigger
                      value="profile"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-love-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-base"
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="timeline"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-love-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-base"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="profile" className="p-6 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-love-500" />
                      About {userData.displayName}
                    </h2>

                    {userData.bio ? (
                      <p className="text-muted-foreground leading-relaxed">{userData.bio}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No biography provided</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Heart className="mr-2 h-4 w-4 text-love-500" />
                          Relationship Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground italic">Not shared</p>
                      </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4 text-love-500" />
                          Public Compliments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Link to="/public-compliments" className="text-love-600 dark:text-love-400 hover:underline inline-flex items-center">
                          <Bookmark className="mr-2 h-4 w-4" />
                          View their compliments
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="py-6 px-4 focus-visible:outline-none focus-visible:ring-0">
                  {timelineEvents.length === 0 ? (
                    <div className="text-center p-10 border border-dashed rounded-lg bg-muted/30">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
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
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-love-300 via-love-400 to-love-300 dark:from-love-800 dark:via-love-700 dark:to-love-800 z-0 opacity-50" />

                      <div className="relative z-10 space-y-12">
                        {timelineEvents.map((event, index) => {
                          const isEven = index % 2 === 0;
                          const eventDate = event.date instanceof Date
                            ? event.date
                            : (event.date as unknown as Timestamp).toDate();

                          return (
                            <div
                              key={event.id}
                              className="flex items-center justify-center"
                              style={{ animationDelay: `${index * 150}ms` }}
                            >
                              <div
                                className={cn(
                                  "w-full md:w-5/12 p-1 animate-fade-in",
                                  isEven ? "md:mr-auto" : "md:ml-auto"
                                )}
                                style={{ animationDelay: `${index * 150}ms` }}
                              >
                                <Card className={cn(
                                  "w-full transition-all hover:shadow-md overflow-hidden group",
                                  isEven ? "md:rounded-tr-3xl" : "md:rounded-tl-3xl"
                                )}>
                                  <CardHeader className="pb-2 bg-gradient-to-r from-background to-muted/30 group-hover:from-background/80 group-hover:to-muted/50 transition-colors">
                                    <CardTitle className="text-xl group-hover:text-love-600 dark:group-hover:text-love-400 transition-colors">
                                      {event.title}
                                    </CardTitle>
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
                                    <div className="px-6 pt-2">
                                      <div className="w-full h-48 rounded-md overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                        <img
                                          src={event.imageUrl}
                                          alt={event.title}
                                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <CardContent>
                                    <p className="whitespace-pre-wrap text-muted-foreground group-hover:text-foreground transition-colors">
                                      {event.description}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Timeline dot */}
                              <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-love-500 border-2 border-background shadow-lg animate-pulse z-10"></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Follow Dialog - Showing actual followers/following users */}
      <Dialog open={followDialogOpen} onOpenChange={setFollowDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {dialogType === "followers" ? (
                <>
                  <Users className="mr-2 h-5 w-5 text-love-500" />
                  Followers
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5 text-love-500" />
                  Following
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "followers"
                ? `People who follow ${userData?.displayName}`
                : `People whom ${userData?.displayName} follows`}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] mt-2">
            {loadingFollowUsers ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="md" />
              </div>
            ) : followUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No {dialogType} found.
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-1">
                {followUsers.map((followUser, index) => (
                  <div
                    key={followUser.uid}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/80 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border shadow-sm">
                        <AvatarImage src={followUser.photoURL || ""} />
                        <AvatarFallback className="bg-love-100 text-love-800 dark:bg-love-900 dark:text-love-100">
                          {getInitials(followUser.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{followUser.displayName}</p>
                        {followUser.location && (
                          <p className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {followUser.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="ml-auto text-xs hover:bg-love-100 hover:text-love-800 dark:hover:bg-love-900/30 dark:hover:text-love-200 transition-colors"
                    >
                      <Link to={`/profile/${followUser.uid}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;