
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Heart, Image as ImageIcon, Plus, Users, X, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  TimelineEvent, addTimelineEvent, getTimelineEvents, updateTimelineEvent, 
  deleteTimelineEvent, uploadTimelineImage 
} from "@/lib/firebase";

export default function RelationshipTimeline() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Event form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventColor, setEventColor] = useState("bg-love-100 dark:bg-love-900/50");
  const [eventIconColor, setEventIconColor] = useState("text-love-600 dark:text-love-400");
  const [eventBorderColor, setEventBorderColor] = useState("border-love-200 dark:border-love-800/50");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  
  // Timeline events state
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/get-started");
      return;
    }

    loadTimelineEvents();
  }, [user, navigate]);

  const loadTimelineEvents = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const timelineEvents = await getTimelineEvents(user.uid);
      setEvents(timelineEvents);
    } catch (error) {
      console.error("Error loading timeline events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load timeline events."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDate("");
    setEventDescription("");
    setEventColor("bg-love-100 dark:bg-love-900/50");
    setEventIconColor("text-love-600 dark:text-love-400");
    setEventBorderColor("border-love-200 dark:border-love-800/50");
    setIsPublic(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setCurrentEventId(null);
    setIsEditingEvent(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEventTitle(event.title);
    setEventDate(event.date);
    setEventDescription(event.description);
    setEventColor(event.color || "bg-love-100 dark:bg-love-900/50");
    setEventIconColor(event.iconColor || "text-love-600 dark:text-love-400");
    setEventBorderColor(event.borderColor || "border-love-200 dark:border-love-800/50");
    setIsPublic(event.isPublic);
    setPreviewImage(event.imageUrl || null);
    setCurrentEventId(event.id || null);
    setIsEditingEvent(true);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!eventTitle || !eventDate || !eventDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      let imageUrl = previewImage;
      // Only upload a new image if a file was selected
      if (selectedFile) {
        imageUrl = await uploadTimelineImage(user.uid, selectedFile);
      }
      
      const eventData: Omit<TimelineEvent, 'id' | 'createdAt'> = {
        userId: user.uid,
        title: eventTitle,
        date: eventDate,
        description: eventDescription,
        color: eventColor,
        iconColor: eventIconColor,
        borderColor: eventBorderColor,
        isPublic: isPublic,
        ...(imageUrl && { imageUrl })
      };
      
      if (isEditingEvent && currentEventId) {
        // Update existing event
        await updateTimelineEvent(currentEventId, eventData);
        toast({
          title: "Success",
          description: "Timeline event updated successfully."
        });
      } else {
        // Add new event
        await addTimelineEvent(eventData);
        toast({
          title: "Success",
          description: "New memory added to your timeline."
        });
      }
      
      // Reload timeline events and reset form
      await loadTimelineEvents();
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error saving timeline event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save timeline event."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      await deleteTimelineEvent(eventId);
      
      // Remove event from state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      toast({
        title: "Success",
        description: "Timeline event deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting timeline event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete timeline event."
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEventVisibility = async (event: TimelineEvent) => {
    if (!event.id) return;
    
    try {
      const newIsPublic = !event.isPublic;
      await updateTimelineEvent(event.id, { isPublic: newIsPublic });
      
      // Update event in state
      setEvents(prevEvents => 
        prevEvents.map(e => 
          e.id === event.id ? { ...e, isPublic: newIsPublic } : e
        )
      );
      
      toast({
        title: "Success",
        description: `Event is now ${newIsPublic ? 'public' : 'private'}.`
      });
    } catch (error) {
      console.error("Error updating event visibility:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event visibility."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="animate-spin h-8 w-8 border-4 border-love-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-foreground/70">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1 pt-24">
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="w-full">
            {/* Header */}
            <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-love-50/40 via-background to-background dark:from-midnight-900/20 dark:via-background dark:to-background z-0"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/5 w-64 h-64 rounded-full bg-love-200/20 dark:bg-love-800/10 blur-3xl animate-float opacity-70"></div>
              <div className="absolute bottom-1/3 left-1/5 w-56 h-56 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float opacity-60" style={{animationDelay: "2s"}}></div>
              
              <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4 animate-fade-in">
                    <span className="text-sm font-medium text-love-600 dark:text-love-400 flex items-center justify-center">
                      <Users size={14} className="mr-1.5 animate-pulse-slow" />
                      Your Journey
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-text-shimmer">
                    Your Relationship <span className="font-great-vibes text-5xl md:text-6xl gradient-text">Timeline</span>
                  </h1>
                  <p className="text-lg md:text-xl text-foreground/80 animate-text-fade">
                    Document your journey of love with a beautiful, interactive timeline of your special moments.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Timeline Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Add New Event Button */}
                  <div className="flex justify-center mb-12">
                    <Button onClick={handleOpenAddModal} className="bg-gradient-love hover:opacity-90 transition-all duration-300 rounded-xl py-6 px-8 shadow-lg hover:shadow-love-500/20">
                      <Plus size={18} className="mr-2" />
                      Add New Memory
                    </Button>
                  </div>
                  
                  {/* Timeline */}
                  {events.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 dark:bg-midnight-800/30 rounded-xl">
                      <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Your Timeline is Empty</h3>
                      <p className="text-foreground/70 mb-6">
                        Start documenting your special moments by adding your first memory.
                      </p>
                      <Button onClick={handleOpenAddModal} className="bg-gradient-love hover:opacity-90">
                        <Plus size={18} className="mr-2" />
                        Add Your First Memory
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-love-200 via-love-300 to-love-200 dark:from-love-800/30 dark:via-love-700/30 dark:to-love-800/30 rounded-full opacity-70"></div>
                      
                      {/* Timeline events */}
                      <div className="space-y-16">
                        {events.map((event, index) => (
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
                                  <Heart className={cn("h-5 w-5", event.iconColor || "text-love-600 dark:text-love-400")} />
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
                              
                              <div className="flex justify-between mt-4 pt-4 border-t border-foreground/10">
                                <div className="flex items-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={() => toggleEventVisibility(event)}
                                  >
                                    {event.isPublic ? (
                                      <>
                                        <Eye className="h-4 w-4 mr-1" />
                                        Public
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="h-4 w-4 mr-1" />
                                        Private
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400"
                                    onClick={() => handleEditEvent(event)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() => handleDeleteEvent(event.id!)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Spacer for opposite side */}
                            <div className="w-5/12"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Final dot */}
                      {events.length > 0 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-love-200 dark:bg-love-800/50 border-4 border-love-500 dark:border-love-600 z-10 animate-pulse-slow"></div>
                      )}
                    </div>
                  )}
                  
                  {/* Add another memory button at bottom */}
                  {events.length > 0 && (
                    <div className="mt-16 text-center">
                      <p className="text-foreground/70 mb-4">Your story is just beginning. Add more memories to your timeline!</p>
                      <Button 
                        onClick={handleOpenAddModal}
                        className="bg-white/80 dark:bg-midnight-800/50 text-love-600 dark:text-love-400 hover:bg-love-50 dark:hover:bg-love-900/20 border border-love-200 dark:border-love-800/50 rounded-xl py-5 px-8"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Another Memory
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            {/* Add/Edit Event Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditingEvent ? "Edit Memory" : "Add New Memory"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingEvent 
                      ? "Update the details of this special moment." 
                      : "Capture a special moment to add to your relationship timeline."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="First Date, Anniversary, etc." 
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="What made this moment special?" 
                      className="min-h-[100px]"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Add Photo (Optional)</Label>
                    <div className="flex items-center space-x-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {previewImage ? "Change Image" : "Upload Image"}
                      </Button>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {previewImage && (
                        <Button 
                          type="button" 
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto"
                          onClick={() => {
                            setPreviewImage(null);
                            setSelectedFile(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    {previewImage && (
                      <div className="mt-2 relative">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="h-40 w-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="color">Style (Optional)</Label>
                    <Select 
                      value={eventColor} 
                      onValueChange={(value) => {
                        // Set coordinated colors for consistent styling
                        setEventColor(value);
                        switch (value) {
                          case "bg-love-100 dark:bg-love-900/50":
                            setEventIconColor("text-love-600 dark:text-love-400");
                            setEventBorderColor("border-love-200 dark:border-love-800/50");
                            break;
                          case "bg-amber-100 dark:bg-amber-900/50":
                            setEventIconColor("text-amber-600 dark:text-amber-400");
                            setEventBorderColor("border-amber-200 dark:border-amber-800/50");
                            break;
                          case "bg-cyan-100 dark:bg-cyan-900/50":
                            setEventIconColor("text-cyan-600 dark:text-cyan-400");
                            setEventBorderColor("border-cyan-200 dark:border-cyan-800/50");
                            break;
                          case "bg-emerald-100 dark:bg-emerald-900/50":
                            setEventIconColor("text-emerald-600 dark:text-emerald-400");
                            setEventBorderColor("border-emerald-200 dark:border-emerald-800/50");
                            break;
                          case "bg-purple-100 dark:bg-purple-900/50":
                            setEventIconColor("text-purple-600 dark:text-purple-400");
                            setEventBorderColor("border-purple-200 dark:border-purple-800/50");
                            break;
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bg-love-100 dark:bg-love-900/50">Love Pink</SelectItem>
                        <SelectItem value="bg-amber-100 dark:bg-amber-900/50">Sunset Gold</SelectItem>
                        <SelectItem value="bg-cyan-100 dark:bg-cyan-900/50">Ocean Blue</SelectItem>
                        <SelectItem value="bg-emerald-100 dark:bg-emerald-900/50">Forest Green</SelectItem>
                        <SelectItem value="bg-purple-100 dark:bg-purple-900/50">Royal Purple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isPublic" 
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <Label htmlFor="isPublic">Make this memory public</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-gradient-love"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      isEditingEvent ? "Update Memory" : "Add Memory"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
