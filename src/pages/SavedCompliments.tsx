
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Compliment, getSavedCompliments, toggleSaveCompliment, deleteCompliment } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Trash2, CalendarDays, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";

const SavedCompliments = () => {
  const { user } = useAuth();
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text animate-text-shimmer">
            Your Saved Compliments
          </h1>

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
          ) : compliments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-love-100/50 dark:bg-love-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-love-600 dark:text-love-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">No saved compliments yet</h2>
              <p className="text-muted-foreground mb-6">Your saved compliments will appear here</p>
              <Button 
                className="bg-gradient-love hover:opacity-90 button-glow py-6 text-lg"
                onClick={() => navigate("/")}
              >
                Generate New Compliments
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              {compliments.map((compliment) => (
                <Card key={compliment.id} className="glass overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-love-600 dark:text-love-400">
                          {compliment.recipient ? `For ${compliment.recipient}` : "Compliment"}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {compliment.createdAt && new Date(compliment.createdAt.seconds * 1000).toLocaleDateString()}
                        </CardDescription>
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
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedCompliments;
