import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  getPublicCompliments, 
  toggleLikeCompliment, 
  addComment, 
  getComplimentComments,
  deleteComment,
  getUserById,
  type Compliment,
  type Comment
} from "@/lib/firebase";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Heart, MessageCircle, Send, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";

const PublicCompliments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentsByCompliment, setCommentsByCompliment] = useState<Record<string, Comment[]>>({});
  const [showCommentsFor, setShowCommentsFor] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [userCache, setUserCache] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchCompliments = async () => {
      try {
        const publicCompliments = await getPublicCompliments();
        setCompliments(publicCompliments);
        
        // Fetch user data for each compliment
        const userIds = publicCompliments
          .map(comp => comp.userId)
          .filter((id): id is string => !!id); // Filter out undefined/null
        
        const uniqueUserIds = [...new Set(userIds)];
        const userPromises = uniqueUserIds.map(async (userId) => {
          try {
            const userData = await getUserById(userId);
            return { userId, userData };
          } catch (error) {
            console.error(`Error fetching user data for ID ${userId}:`, error);
            return { userId, userData: null };
          }
        });
        
        const usersData = await Promise.all(userPromises);
        const newUserCache: Record<string, any> = {};
        
        usersData.forEach(({ userId, userData }) => {
          if (userData) {
            newUserCache[userId] = userData;
          }
        });
        
        setUserCache(prevCache => ({ ...prevCache, ...newUserCache }));
      } catch (error) {
        console.error("Error fetching compliments:", error);
        toast.error("Failed to load compliments");
      } finally {
        setLoading(false);
      }
    };

    fetchCompliments();
  }, []);

  const handleLikeToggle = async (complimentId: string) => {
    if (!user) {
      toast.error("Please sign in to like compliments");
      navigate("/get-started");
      return;
    }

    try {
      const liked = await toggleLikeCompliment(complimentId, user.uid);
      
      setCompliments(prevCompliments => 
        prevCompliments.map(comp => {
          if (comp.id === complimentId) {
            const likedBy = [...(comp.likedBy || [])];
            
            if (liked) {
              likedBy.push(user.uid);
            } else {
              const index = likedBy.indexOf(user.uid);
              if (index > -1) {
                likedBy.splice(index, 1);
              }
            }
            
            return {
              ...comp,
              likedBy,
              likeCount: likedBy.length
            };
          }
          return comp;
        })
      );
      
      toast.success(liked ? "Compliment liked!" : "Compliment unliked");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    }
  };

  const loadComments = async (complimentId: string) => {
    if (loadingComments[complimentId]) return;
    
    setLoadingComments(prev => ({ ...prev, [complimentId]: true }));
    
    try {
      const comments = await getComplimentComments(complimentId);
      setCommentsByCompliment(prev => ({
        ...prev,
        [complimentId]: comments
      }));
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(prev => ({ ...prev, [complimentId]: false }));
    }
  };

  const toggleComments = async (complimentId: string) => {
    const isCurrentlyShown = showCommentsFor[complimentId];
    
    setShowCommentsFor(prev => ({
      ...prev,
      [complimentId]: !isCurrentlyShown
    }));
    
    if (!isCurrentlyShown && (!commentsByCompliment[complimentId] || commentsByCompliment[complimentId].length === 0)) {
      await loadComments(complimentId);
    }
  };

  const handleCommentSubmit = async (complimentId: string) => {
    if (!user) {
      toast.error("Please sign in to add comments");
      navigate("/get-started");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await addComment({
        complimentId,
        userId: user.uid,
        userDisplayName: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL || undefined,
        content: commentText
      });
      
      setCommentText("");
      toast.success("Comment added successfully");
      
      await loadComments(complimentId);
      
      setCompliments(prevCompliments => 
        prevCompliments.map(comp => {
          if (comp.id === complimentId) {
            return {
              ...comp,
              commentCount: (comp.commentCount || 0) + 1
            };
          }
          return comp;
        })
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string, complimentId: string) => {
    try {
      await deleteComment(commentId, complimentId);
      
      setCommentsByCompliment(prev => ({
        ...prev,
        [complimentId]: prev[complimentId].filter(comment => comment.id !== commentId)
      }));
      
      setCompliments(prevCompliments => 
        prevCompliments.map(comp => {
          if (comp.id === complimentId) {
            return {
              ...comp,
              commentCount: Math.max(0, (comp.commentCount || 0) - 1)
            };
          }
          return comp;
        })
      );
      
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ")
      .map(part => part[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar toggleSidebar={() => {}} />
        <main className="flex-1 container mx-auto py-28 flex items-center justify-center">
          <Spinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />

      <Navbar toggleSidebar={() => {}} />

      <main className="flex-1 container mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Public Compliments</h1>
          <p className="text-xl text-foreground/80 mb-6 max-w-2xl mx-auto">
            Explore beautiful compliments shared by our community. Like your favorites and leave comments!
          </p>
        </div>

        {compliments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No public compliments found. Be the first to share one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
            {compliments.map(compliment => {
              const complimentAuthor = compliment.userId ? userCache[compliment.userId] : null;
              return (
                <Card key={compliment.id} className="backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {complimentAuthor ? (
                          <Link to={`/profile/${compliment.userId}`} className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={complimentAuthor.photoURL} alt={complimentAuthor.displayName} />
                              <AvatarFallback>{getInitials(complimentAuthor.displayName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium flex items-center">
                                {complimentAuthor.displayName || "Anonymous"}
                                {complimentAuthor.subscription?.level === "premium" && (
                                  <Badge variant="outline" className="ml-2 bg-gradient-love text-white border-0 px-1 text-xs">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Shared publicly
                          </div>
                        )}
                      </div>
                      {compliment.recipient && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">To: </span>
                          <span className="font-medium">{compliment.recipient}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <p className="text-lg font-medium mb-2">{compliment.content}</p>
                    
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
                  </CardContent>
                  
                  <CardFooter className="flex-col items-stretch pt-2">
                    <div className="flex items-center justify-between border-t border-border pt-3 mb-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={`flex items-center gap-2 ${user && compliment.likedBy?.includes(user.uid) ? 'text-love-500 hover:text-love-600' : ''}`}
                          onClick={() => compliment.id && handleLikeToggle(compliment.id)}
                        >
                          <Heart 
                            className={`h-4 w-4 ${user && compliment.likedBy?.includes(user.uid) ? 'fill-love-500' : ''}`} 
                          />
                          <span>{compliment.likeCount || 0}</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => compliment.id && toggleComments(compliment.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{compliment.commentCount || 0}</span>
                        </Button>
                      </div>
                    </div>
                    
                    {compliment.id && showCommentsFor[compliment.id] && (
                      <div className="w-full mt-2 border-t border-border pt-3">
                        {loadingComments[compliment.id] ? (
                          <div className="flex justify-center py-3">
                            <Spinner size="sm" />
                          </div>
                        ) : (
                          <>
                            <div className="mb-3">
                              {commentsByCompliment[compliment.id]?.length > 0 ? (
                                <div className="space-y-3">
                                  {commentsByCompliment[compliment.id].map(comment => (
                                    <div key={comment.id} className="flex gap-2 group">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={comment.userPhotoURL} alt={comment.userDisplayName} />
                                        <AvatarFallback>{getInitials(comment.userDisplayName)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 bg-background/50 rounded-lg p-2 relative">
                                        <div className="flex justify-between">
                                          <div className="font-medium text-sm">{comment.userDisplayName}</div>
                                          {user && comment.userId === user.uid && (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
                                              onClick={() => comment.id && handleDeleteComment(comment.id, compliment.id)}
                                            >
                                              <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                          )}
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground text-center py-2">
                                  No comments yet. Be the first to comment!
                                </p>
                              )}
                            </div>
                            
                            {user ? (
                              <div className="flex gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                                  <AvatarFallback>{getInitials(user.displayName || "User")}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex">
                                  <Input
                                    value={activeCommentId === compliment.id ? commentText : ""}
                                    onChange={(e) => {
                                      setCommentText(e.target.value);
                                      setActiveCommentId(compliment.id || null);
                                    }}
                                    placeholder="Add a comment..."
                                    className="rounded-r-none bg-background/50"
                                  />
                                  <Button 
                                    variant="default" 
                                    size="icon"
                                    className="rounded-l-none bg-primary/80"
                                    onClick={() => compliment.id && handleCommentSubmit(compliment.id)}
                                    disabled={!commentText.trim() && activeCommentId === compliment.id}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate("/get-started")}
                                >
                                  Sign in to comment
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicCompliments;