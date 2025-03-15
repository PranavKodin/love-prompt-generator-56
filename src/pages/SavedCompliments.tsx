
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Compliment, 
  getUserCompliments, 
  updateCompliment, 
  deleteCompliment, 
  toggleLikeCompliment 
} from "@/lib/firebase";
import { Heart, MoreHorizontal, Edit, Trash, Lock, Unlock, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/Spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

const SavedCompliments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCompliment, setCurrentCompliment] = useState<Compliment | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadCompliments();
    }
  }, [user]);
  
  const loadCompliments = async () => {
    setLoading(true);
    try {
      if (user?.uid) {
        const userCompliments = await getUserCompliments(user.uid);
        setCompliments(userCompliments);
      }
    } catch (error) {
      console.error("Error loading compliments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your saved compliments"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (compliment: Compliment) => {
    setCurrentCompliment(compliment);
    setEditedContent(compliment.content);
    setIsPublic(compliment.isPublic);
    setEditDialogOpen(true);
  };
  
  const handleDelete = (compliment: Compliment) => {
    setCurrentCompliment(compliment);
    setDeleteDialogOpen(true);
  };
  
  const handleSaveEdit = async () => {
    if (!currentCompliment || !currentCompliment.id) return;
    
    try {
      await updateCompliment(currentCompliment.id, {
        content: editedContent,
        isPublic: isPublic
      });
      
      // Update local state
      setCompliments(prev => 
        prev.map(c => 
          c.id === currentCompliment.id 
            ? { ...c, content: editedContent, isPublic: isPublic } 
            : c
        )
      );
      
      toast({
        title: "Success",
        description: "Compliment updated successfully"
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating compliment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update compliment"
      });
    }
  };
  
  const confirmDelete = async () => {
    if (!currentCompliment || !currentCompliment.id) return;
    
    try {
      await deleteCompliment(currentCompliment.id);
      
      // Update local state
      setCompliments(prev => prev.filter(c => c.id !== currentCompliment.id));
      
      toast({
        title: "Success",
        description: "Compliment deleted successfully"
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting compliment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete compliment"
      });
    }
  };
  
  const handleToggleLike = async (compliment: Compliment) => {
    if (!user?.uid || !compliment.id) return;
    
    try {
      const liked = await toggleLikeCompliment(compliment.id, user.uid);
      
      // Update local state
      setCompliments(prev => 
        prev.map(c => {
          if (c.id === compliment.id) {
            const likedBy = [...(c.likedBy || [])];
            
            if (liked) {
              likedBy.push(user.uid);
            } else {
              const index = likedBy.indexOf(user.uid);
              if (index > -1) likedBy.splice(index, 1);
            }
            
            return {
              ...c,
              likedBy,
              likeCount: likedBy.length
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like/unlike compliment"
      });
    }
  };
  
  const handleTogglePublic = async (compliment: Compliment) => {
    if (!compliment.id) return;
    
    try {
      await updateCompliment(compliment.id, {
        isPublic: !compliment.isPublic
      });
      
      // Update local state
      setCompliments(prev => 
        prev.map(c => 
          c.id === compliment.id 
            ? { ...c, isPublic: !c.isPublic } 
            : c
        )
      );
      
      toast({
        title: "Success",
        description: `Compliment is now ${!compliment.isPublic ? 'public' : 'private'}`
      });
    } catch (error) {
      console.error("Error toggling public status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update compliment visibility"
      });
    }
  };
  
  const filteredCompliments = compliments.filter(compliment => {
    if (activeTab === "all") return true;
    if (activeTab === "public") return compliment.isPublic;
    if (activeTab === "private") return !compliment.isPublic;
    return true;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Saved Compliments</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredCompliments.length === 0 ? (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            You don't have any {activeTab !== "all" ? activeTab : ""} saved compliments yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompliments.map((compliment) => (
            <Card key={compliment.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {compliment.isPublic ? (
                      <Unlock className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <CardTitle className="text-sm text-muted-foreground">
                      {compliment.isPublic ? "Public" : "Private"}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(compliment)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePublic(compliment)}>
                        {compliment.isPublic ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Make Private
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Make Public
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(compliment)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {compliment.createdAt && (
                  <CardDescription>
                    Saved on {format(
                      compliment.createdAt.toDate(), 
                      "MMM d, yyyy"
                    )}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{compliment.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-sm"
                    onClick={() => handleToggleLike(compliment)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        user && compliment.likedBy?.includes(user.uid) 
                          ? "fill-red-500 text-red-500" 
                          : "text-muted-foreground"
                      }`} 
                    />
                    <span>{compliment.likeCount || 0}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Compliment</DialogTitle>
            <DialogDescription>
              Make changes to your compliment. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea 
              value={editedContent} 
              onChange={(e) => setEditedContent(e.target.value)} 
              className="min-h-[150px]"
            />
            <div className="flex items-center space-x-2">
              <Switch 
                id="public" 
                checked={isPublic} 
                onCheckedChange={setIsPublic} 
              />
              <Label htmlFor="public">
                Make this compliment public
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={!editedContent.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this compliment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedCompliments;
