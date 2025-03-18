import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share, Clock, UserPlus, UserCheck, Users, Star } from "lucide-react";
import { format } from "date-fns";
import { Compliment, getFollowingCompliments, toggleLikeCompliment, getUserProfile } from "@/lib/firebase";
import { Timestamp } from "@/lib/firebase";

const FollowingFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadCompliments();
    }
  }, [user]);
  
  const loadCompliments = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const feedCompliments = await getFollowingCompliments(user.uid);
      setCompliments(feedCompliments);
      
      // Load user details for each compliment
      const userIds = Array.from(new Set(feedCompliments.map(c => c.userId)));
      const details: Record<string, any> = {};
      
      for (const userId of userIds) {
        const profile = await getUserProfile(userId);
        if (profile) {
          details[userId] = profile;
        }
      }
      
      setUserDetails(details);
    } catch (error) {
      console.error("Error loading following feed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load compliments from people you follow"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = async (complimentId: string) => {
    if (!user) return;
    
    try {
      const isLiked = await toggleLikeCompliment(complimentId, user.uid);
      
      // Update UI optimistically
      setCompliments(prev => prev.map(compliment => {
        if (compliment.id === complimentId) {
          const likedBy = [...(compliment.likedBy || [])];
          
          if (isLiked) {
            likedBy.push(user.uid);
          } else {
            const index = likedBy.indexOf(user.uid);
            if (index !== -1) {
              likedBy.splice(index, 1);
            }
          }
          
          return {
            ...compliment,
            likeCount: likedBy.length,
            likedBy
          };
        }
        return compliment;
      }));
      
      toast({
        title: isLiked ? "Compliment liked" : "Like removed",
        description: isLiked ? "You liked this compliment" : "You removed your like from this compliment"
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like/unlike compliment"
      });
    }
  };
  
  const handleShare = (compliment: Compliment) => {
    if (navigator.share) {
      navigator.share({
        title: "Shared Compliment",
        text: compliment.content,
        url: window.location.href
      }).catch(error => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      toast({
        title: "Share link copied",
        description: "Link copied to clipboard!"
      });
      
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="container mx-auto py-28 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text">Following Feed</h1>
          <p className="text-muted-foreground">
            See compliments from people you follow
          </p>
        </div>
        
        {compliments.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No compliments yet</h3>
            <p className="text-muted-foreground mb-6">
              Follow more people to see their compliments in your feed, or check back later.
            </p>
            <Button 
              asChild
              className="bg-gradient-love hover:opacity-90 transition-opacity"
            >
              <Link to="/discover">
                <UserPlus className="mr-2 h-4 w-4" />
                Find People to Follow
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compliments.map((compliment) => {
              const userDetail = userDetails[compliment.userId] || {};
              const isLiked = compliment.likedBy?.includes(user?.uid || "") || false;
              const timestamp = compliment.createdAt instanceof Timestamp 
                ? compliment.createdAt.toDate()
                : new Date(compliment.createdAt);
              const isPremium = userDetail.subscription?.level === "premium";
              
              return (
                <Card key={compliment.id} className="overflow-hidden hover:shadow-md transition-shadow backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <Link to={`/profile/${compliment.userId}`}>
                        <Avatar className="ring-1 ring-love-200 dark:ring-love-800 transition-all hover:ring-love-500">
                          <AvatarImage src={userDetail.photoURL} alt={userDetail.displayName} />
                          <AvatarFallback className="bg-gradient-love text-white">
                            {userDetail.displayName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/profile/${compliment.userId}`} className="hover:underline">
                          <CardTitle className="text-base flex items-center gap-1">
                            <span className="bg-gradient-to-r from-love-600 to-love-400 bg-clip-text text-transparent font-semibold">
                              {userDetail.displayName || "User"}
                            </span>
                            {isPremium && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </CardTitle>
                        </Link>
                        <CardDescription className="flex items-center text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(timestamp, "MMM d, yyyy 'at' h:mm a")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <p className="whitespace-pre-wrap">{compliment.content}</p>
                    
                    {(compliment.tone || compliment.mood) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {compliment.tone && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {compliment.tone}
                          </span>
                        )}
                        {compliment.mood && (
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                            {compliment.mood}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={isLiked ? "text-love-500" : ""}
                        onClick={() => compliment.id && handleLike(compliment.id)}
                      >
                        <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-love-500" : ""}`} />
                        <span>{compliment.likeCount || 0}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/discover?complimentId=${compliment.id}`}>
                          <MessageCircle className="mr-1 h-4 w-4" />
                          <span>{compliment.commentCount || 0}</span>
                        </Link>
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShare(compliment)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default FollowingFeed;