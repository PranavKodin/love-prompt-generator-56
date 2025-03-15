
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Compliment, 
  getSavedCompliments, 
  toggleSaveCompliment, 
  deleteCompliment,
  updateCompliment,
  toggleLikeCompliment
} from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Trash2, 
  CalendarDays, 
  X, 
  Edit2, 
  Lock, 
  Globe, 
  Save,
  ThumbsUp
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SavedCompliments = () => {
  const { user } = useAuth();
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCompliment, setEditingCompliment] = useState<Compliment | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/get-started");
      return;
    }

    const fetchCompliments = async () => {
      setLoading(true);
      try {
        const results = await getSavedCompliments(user.uid);
        setCompliments(results);
      } catch (error) {
        console.error("Error fetching saved compliments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your saved compliments",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompliments();
  }, [user, navigate, toast]);

  const handleUnsave = async (complimentId: string) => {
    try {
      await toggleSaveCompliment(complimentId, false);
      setCompliments(compliments.filter(c => c.id !== complimentId));
      
      toast({
        title: "Compliment removed",
        description: "Compliment has been removed from your saved list",
      });
    } catch (error) {
      console.error("Error unsaving compliment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove compliment",
      });
    }
  };

  const handleDelete = async (complimentId: string) => {
    try {
      await deleteCompliment(complimentId);
      setCompliments(compliments.filter(c => c.id !== complimentId));
      
      toast({
        title: "Compliment deleted",
        description: "Compliment has been permanently deleted",
      });
    } catch (error) {
      console.error("Error deleting compliment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete compliment",
      });
    }
  };

  const handleEdit = (compliment: Compliment) => {
    setEditingCompliment(compliment);
    setEditedContent(compliment.content);
    setIsPublic(compliment.isPublic || false);
    setEditDialogOpen(true);
  };

  const saveEditedCompliment = async () => {
    if (!editingCompliment) return;
    
    try {
      const updatedCompliment = await updateCompliment(editingCompliment.id!, {
        content: editedContent,
        isPublic
      });
      
      // Update the compliments state
      setCompliments(compliments.map(c => 
        c.id === editingCompliment.id ? updatedCompliment : c
      ));
      
      setEditDialogOpen(false);
      
      toast({
        title: "Compliment updated",
        description: "Your changes have been saved",
      });
    } catch (error) {
      console.error("Error updating compliment:", error);
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to update compliment",
      });
    }
  };

  const handleToggleLike = async (complimentId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to like compliments",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const isNowLiked = await toggleLikeCompliment(complimentId, user.uid);
      
      // Update local state to reflect like change
      setCompliments(compliments.map(c => {
        if (c.id === complimentId) {
          const likedBy = c.likedBy || [];
          const currentLikeCount = c.likeCount || 0;
          
          if (isNowLiked) {
            return {
              ...c,
              likeCount: currentLikeCount + 1,
              likedBy: [...likedBy, user.uid]
            };
          } else {
            return {
              ...c,
              likeCount: currentLikeCount - 1,
              likedBy: likedBy.filter(id => id !== user.uid)
            };
          }
        }
        return c;
      }));
      
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like compliment",
      });
    }
  };

  const filteredCompliments = activeTab === "all" 
    ? compliments 
    : activeTab === "public" 
      ? compliments.filter(c => c.isPublic) 
      : compliments.filter(c => !c.isPublic);

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center gradient-text animate-text-shimmer">
            Your Saved Compliments
          </h1>

          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <div className="flex justify-center">
              <TabsList className="bg-love-100/50 dark:bg-love-900/30">
                <TabsTrigger value="all" className="data-[state=active]:bg-love-200 dark:data-[state=active]:bg-love-800/50">
                  All Compliments
                </TabsTrigger>
                <TabsTrigger value="public" className="data-[state=active]:bg-love-200 dark:data-[state=active]:bg-love-800/50">
                  Public
                </TabsTrigger>
                <TabsTrigger value="private" className="data-[state=active]:bg-love-200 dark:data-[state=active]:bg-love-800/50">
                  Private
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="glass animate-pulse-slow">
                  <CardHeader>
                    <div className="h-6 bg-white/20 dark:bg-midnight-800/30 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 dark:bg-midnight-800/20 rounded w-1/4 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-white/10 dark:bg-midnight-800/20 rounded"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-white/20 dark:bg-midnight-800/30 rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredCompliments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-love-100/50 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-love-600 dark:text-love-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">No {activeTab !== "all" ? activeTab : ""} compliments found</h2>
              <p className="text-muted-foreground mb-6">
                {activeTab === "all" 
                  ? "Your saved compliments will appear here" 
                  : activeTab === "public" 
                    ? "You don't have any public compliments yet" 
                    : "You don't have any private compliments yet"}
              </p>
              <Button 
                className="bg-gradient-love hover:opacity-90 button-glow py-6 text-lg"
                onClick={() => navigate("/")}
              >
                Generate New Compliments
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              {filteredCompliments.map((compliment) => (
                <Card key={compliment.id} className="glass overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <CardTitle className="text-xl text-love-600 dark:text-love-400 flex items-center">
                          {compliment.recipient ? `For ${compliment.recipient}` : "Compliment"}
                          {compliment.isPublic ? (
                            <Globe className="h-4 w-4 ml-2 text-green-500" />
                          ) : (
                            <Lock className="h-4 w-4 ml-2 text-amber-500" />
                          )}
                        </CardTitle>
                        {compliment.likeCount ? (
                          <span className="ml-3 flex items-center text-sm text-muted-foreground">
                            <ThumbsUp className="h-3.5 w-3.5 mr-1 text-love-400" />
                            {compliment.likeCount}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-love-100/50 dark:hover:bg-love-900/30 text-love-600 dark:text-love-400"
                          onClick={() => handleUnsave(compliment.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {compliment.createdAt && new Date(compliment.createdAt.seconds * 1000).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 font-playfair italic">{compliment.content}</p>
                    <div className="flex mt-4 space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-love-100/50 dark:bg-love-900/30 text-love-600 dark:text-love-400">
                        {compliment.tone}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {compliment.mood}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => handleDelete(compliment.id!)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                        onClick={() => handleEdit(compliment)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      {compliment.isPublic && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/20 ${
                            compliment.likedBy?.includes(user!.uid) ? "bg-red-100/50 dark:bg-red-900/20" : ""
                          }`}
                          onClick={() => handleToggleLike(compliment.id!)}
                        >
                          <Heart 
                            className={`h-4 w-4 mr-2 ${
                              compliment.likedBy?.includes(user!.uid) ? "fill-red-500" : ""
                            }`} 
                          />
                          {compliment.likedBy?.includes(user!.uid) ? "Liked" : "Like"}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-love-200 dark:border-love-800/50 text-love-600 dark:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-900/30"
                        onClick={() => {
                          navigator.clipboard.writeText(compliment.content);
                          toast({
                            title: "Copied",
                            description: "Compliment copied to clipboard",
                          });
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Compliment</DialogTitle>
            <DialogDescription>
              Update your compliment and privacy settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Compliment Text</Label>
              <Textarea
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-toggle">Make Public</Label>
                <p className="text-sm text-muted-foreground">
                  Public compliments can be seen and liked by others
                </p>
              </div>
              <Switch
                id="public-toggle"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveEditedCompliment} className="bg-gradient-love">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedCompliments;
