
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Heart, MessageSquare, Share, Send, XCircle, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMobile } from "@/hooks/use-mobile";
import {
  Story,
  Comment,
  createStory,
  getStories,
  toggleLikeStory,
  addComment,
  getComments,
} from "@/lib/firebase";

const LoveStories = () => {
  const { user } = useAuth();
  const { profile } = useUser();
  const navigate = useNavigate();
  const { toast: notify } = useToast();
  const isMobile = useMobile();
  
  const [stories, setStories] = useState<(Story & { comments?: Comment[] })[]>([]);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [storyContent, setStoryContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isNewStoryOpen, setIsNewStoryOpen] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastStoryElementRef = useRef<HTMLDivElement | null>(null);
  
  // Load initial stories
  useEffect(() => {
    fetchStories();
  }, []);
  
  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreStories();
      }
    });
    
    if (lastStoryElementRef.current) {
      observer.current.observe(lastStoryElementRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasMore, stories.length]);
  
  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const result = await getStories();
      setStories(result.stories);
      setLastDoc(result.lastDoc);
      setHasMore(result.stories.length === 10);
    } catch (error) {
      console.error("Error fetching stories:", error);
      notify({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stories",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMoreStories = async () => {
    if (!lastDoc || isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const result = await getStories(10, lastDoc);
      setStories(prevStories => [...prevStories, ...result.stories]);
      setLastDoc(result.lastDoc);
      setHasMore(result.stories.length === 10);
    } catch (error) {
      console.error("Error fetching more stories:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLikeStory = async (storyId: string) => {
    if (!user) {
      notify({
        title: "Authentication Required",
        description: "Please sign in to like stories",
      });
      navigate("/get-started");
      return;
    }
    
    try {
      // Optimistic update
      setStories(prevStories => 
        prevStories.map(story => {
          if (story.id === storyId) {
            const isLiked = story.likedBy.includes(user.uid);
            return {
              ...story,
              likeCount: isLiked ? story.likeCount - 1 : story.likeCount + 1,
              likedBy: isLiked 
                ? story.likedBy.filter(id => id !== user.uid)
                : [...story.likedBy, user.uid]
            };
          }
          return story;
        })
      );
      
      // Make API call
      await toggleLikeStory(storyId, user.uid);
    } catch (error) {
      console.error("Error liking story:", error);
      // Revert optimistic update if there's an error
      fetchStories();
      notify({
        variant: "destructive",
        title: "Error",
        description: "Failed to like story",
      });
    }
  };
  
  const handleToggleComments = async (storyId: string) => {
    setExpandedComments(prev => {
      const isExpanded = !prev[storyId];
      
      if (isExpanded) {
        // Fetch comments when expanding
        getComments(storyId).then(comments => {
          setStories(prevStories => 
            prevStories.map(story => 
              story.id === storyId ? { ...story, comments } : story
            )
          );
        });
      }
      
      return { ...prev, [storyId]: isExpanded };
    });
  };
  
  const handleCommentChange = (storyId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [storyId]: value }));
  };
  
  const handleAddComment = async (storyId: string) => {
    if (!user) {
      notify({
        title: "Authentication Required",
        description: "Please sign in to comment",
      });
      navigate("/get-started");
      return;
    }
    
    const content = commentInputs[storyId]?.trim();
    if (!content) return;
    
    try {
      const newComment: Omit<Comment, 'id' | 'createdAt'> = {
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
        content,
      };
      
      // Optimistic update
      const comment = {
        ...newComment,
        id: `temp-${Date.now()}`,
        createdAt: Timestamp.now(),
      };
      
      setStories(prevStories => 
        prevStories.map(story => {
          if (story.id === storyId) {
            return {
              ...story,
              commentCount: story.commentCount + 1,
              comments: story.comments 
                ? [comment, ...story.comments]
                : [comment]
            };
          }
          return story;
        })
      );
      
      // Clear input
      setCommentInputs(prev => ({ ...prev, [storyId]: "" }));
      
      // Make API call
      await addComment(storyId, newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      notify({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      });
    }
  };
  
  const handleShareStory = (storyId: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Love Story",
        text: "Check out this beautiful love story!",
        url: `${window.location.origin}/love-stories?id=${storyId}`,
      }).catch(err => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support navigator.share
      const url = `${window.location.origin}/love-stories?id=${storyId}`;
      navigator.clipboard.writeText(url).then(
        () => {
          toast.success("Link copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
          toast.error("Failed to copy link");
        }
      );
    }
  };
  
  const handleSubmitStory = async () => {
    if (!user || !profile) {
      notify({
        title: "Authentication Required",
        description: "Please sign in to share your story",
      });
      navigate("/get-started");
      return;
    }
    
    const content = storyContent.trim();
    if (!content) return;
    
    setIsSubmitting(true);
    
    try {
      const newStory = {
        userId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhotoURL: user.photoURL || "",
        content,
        createdAt: Timestamp.now(),
      };
      
      const createdStory = await createStory(newStory);
      
      // Add the new story to the state
      setStories(prevStories => [createdStory, ...prevStories]);
      
      // Reset form
      setStoryContent("");
      setIsNewStoryOpen(false);
      
      toast.success("Your love story has been shared!");
    } catch (error) {
      console.error("Error creating story:", error);
      notify({
        variant: "destructive",
        title: "Error",
        description: "Failed to share your story",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTimestamp = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Responsive story form based on device
  const StoryForm = () => (
    <>
      {isMobile ? (
        <Drawer open={isNewStoryOpen} onOpenChange={setIsNewStoryOpen}>
          <DrawerTrigger asChild>
            <Button className="fixed bottom-6 right-6 rounded-full shadow-lg size-14 p-0 z-10 bg-gradient-love">
              <Plus size={24} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Share Your Love Story</DrawerTitle>
              <DrawerDescription>
                Write your love story below and share it with the world.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-2">
              <Textarea
                placeholder="Share your love story here..."
                className="min-h-32 resize-none"
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
              />
            </div>
            <DrawerFooter>
              <Button 
                onClick={handleSubmitStory} 
                disabled={isSubmitting || !storyContent.trim()} 
                className="bg-gradient-love"
              >
                {isSubmitting ? "Sharing..." : "Share Story"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isNewStoryOpen} onOpenChange={setIsNewStoryOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-6 right-6 rounded-full shadow-lg size-14 p-0 z-10 bg-gradient-love">
              <Plus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Love Story</DialogTitle>
              <DialogDescription>
                Write your love story below and share it with the world.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Share your love story here..."
              className="min-h-32 resize-none"
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
            />
            <DialogFooter>
              <Button 
                onClick={handleSubmitStory} 
                disabled={isSubmitting || !storyContent.trim()} 
                className="bg-gradient-love"
              >
                {isSubmitting ? "Sharing..." : "Share Story"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
  
  // Render the story card component
  const StoryCard = ({ story, index }: { story: Story & { comments?: Comment[] }, index: number }) => {
    const isLiked = user ? story.likedBy.includes(user.uid) : false;
    const isExpanded = expandedComments[story.id || ""];
    const commentText = commentInputs[story.id || ""] || "";
    const isLast = index === stories.length - 1;
    
    return (
      <div 
        ref={isLast ? lastStoryElementRef : null}
        className="mb-6 animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <Card className="backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="size-12 border-2 border-love-200 dark:border-love-800">
              <AvatarImage src={story.authorPhotoURL} alt={story.authorName} />
              <AvatarFallback>
                {story.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{story.authorName}</h3>
              <p className="text-sm text-muted-foreground">
                {formatTimestamp(story.createdAt)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <div className="whitespace-pre-line text-foreground/90">
              {story.content}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-3">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? 'text-love-500 dark:text-love-400' : 'text-muted-foreground'}`}
                onClick={() => handleLikeStory(story.id || "")}
              >
                <Heart className={`size-5 ${isLiked ? 'fill-love-500 dark:fill-love-400' : ''}`} />
                <span>{story.likeCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground"
                onClick={() => handleToggleComments(story.id || "")}
              >
                <MessageSquare className="size-5" />
                <span>{story.commentCount}</span>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => handleShareStory(story.id || "")}
            >
              <Share className="size-5" />
            </Button>
          </CardFooter>
          
          {/* Comments section */}
          {isExpanded && (
            <div className="px-6 pb-4">
              <Separator className="my-2" />
              
              <div className="flex items-center gap-2 mt-4 mb-6">
                <Avatar className="size-8">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => handleCommentChange(story.id || "", e.target.value)}
                    className="min-h-0 h-10 py-2"
                  />
                  <Button
                    size="icon"
                    disabled={!commentText.trim()}
                    onClick={() => handleAddComment(story.id || "")}
                    className="bg-love-500 hover:bg-love-600 dark:bg-love-600 dark:hover:bg-love-700 size-10"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
              
              {/* Comments list */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {story.comments && story.comments.length > 0 ? (
                  story.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="size-8">
                        <AvatarImage src={comment.photoURL} />
                        <AvatarFallback>
                          {comment.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-background/50 rounded-lg p-3">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{comment.displayName}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />
      
      <Navbar toggleSidebar={() => {}} />
      
      <main className="flex-1 container max-w-3xl mx-auto pt-28 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Love Stories</h1>
        <p className="text-foreground/70 mb-8">
          Explore and share beautiful love stories from around the world
        </p>
        
        <div className="space-y-6">
          {stories.length > 0 ? (
            stories.map((story, index) => (
              <StoryCard 
                key={story.id || index} 
                story={story} 
                index={index} 
              />
            ))
          ) : (
            <Card className="p-8 text-center bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30">
              <h3 className="text-xl font-medium mb-2">No stories yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your love story!
              </p>
              <Button 
                onClick={() => setIsNewStoryOpen(true)}
                className="bg-gradient-love"
              >
                Share Your Story
              </Button>
            </Card>
          )}
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          )}
        </div>
        
        <StoryForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default LoveStories;
