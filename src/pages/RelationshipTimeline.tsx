import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, CalendarIcon, MapPin, Image as ImageIcon, Edit, Trash, Lock, Unlock, Heart } from "lucide-react";
import { format } from "date-fns";
import { Timestamp } from "@/lib/firebase";
import { TimelineEvent, addTimelineEvent, getUserTimelineEvents, updateTimelineEvent, deleteTimelineEvent } from "@/lib/timelineService";
import { cn } from "@/lib/utils";

const RelationshipTimeline = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Form states
  const [currentEvent, setCurrentEvent] = useState<TimelineEvent | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const userEvents = await getUserTimelineEvents(user.uid);
      setEvents(userEvents);
    } catch (error) {
      console.error("Error loading timeline events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load timeline events"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid || !title || !date) return;

    try {
      if (editMode && currentEvent?.id) {
        // Update existing event
        const updatedData: Partial<TimelineEvent> = {
          title,
          description,
          date: Timestamp.fromDate(date),
          location,
          imageUrl,
          isPublic
        };

        await updateTimelineEvent(currentEvent.id, updatedData);

        toast({
          title: "Success",
          description: "Timeline event updated successfully"
        });

        // Update local state
        setEvents(prev =>
          prev.map(event =>
            event.id === currentEvent.id
              ? { ...event, ...updatedData }
              : event
          )
        );
      } else {
        // Create new event
        const newEvent: Omit<TimelineEvent, 'id' | 'createdAt'> = {
          userId: user.uid,
          title,
          description,
          date: Timestamp.fromDate(date),
          location,
          imageUrl,
          isPublic,
        };

        const createdEvent = await addTimelineEvent(newEvent);

        toast({
          title: "Success",
          description: "Timeline event added successfully"
        });

        // Update local state
        setEvents(prev => [createdEvent, ...prev]);
      }

      // Reset form and close dialog
      resetForm();
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving timeline event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save timeline event"
      });
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");

    // Convert Timestamp to Date if needed
    if (event.date instanceof Timestamp) {
      setDate(event.date.toDate());
    } else {
      setDate(new Date(event.date));
    }

    setLocation(event.location || "");
    setImageUrl(event.imageUrl || "");
    setIsPublic(event.isPublic);

    setEditMode(true);
    setFormOpen(true);
  };

  const handleDelete = (event: TimelineEvent) => {
    setCurrentEvent(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentEvent?.id) return;

    try {
      await deleteTimelineEvent(currentEvent.id);

      toast({
        title: "Success",
        description: "Timeline event deleted successfully"
      });

      // Update local state
      setEvents(prev => prev.filter(event => event.id !== currentEvent.id));

      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting timeline event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete timeline event"
      });
    }
  };

  const resetForm = () => {
    setCurrentEvent(null);
    setTitle("");
    setDescription("");
    setDate(new Date());
    setLocation("");
    setImageUrl("");
    setIsPublic(false);
    setEditMode(false);
  };

  const handleTogglePublic = async (event: TimelineEvent) => {
    if (!event.id) return;

    try {
      await updateTimelineEvent(event.id, {
        isPublic: !event.isPublic
      });

      // Update local state
      setEvents(prev =>
        prev.map(e =>
          e.id === event.id
            ? { ...e, isPublic: !e.isPublic }
            : e
        )
      );

      toast({
        title: "Success",
        description: `Event is now ${!event.isPublic ? 'public' : 'private'}`
      });
    } catch (error) {
      console.error("Error toggling public status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event visibility"
      });
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === "all") return true;
    if (activeTab === "public") return event.isPublic;
    if (activeTab === "private") return !event.isPublic;
    return true;
  });

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toDate().getTime() : new Date(a.date).getTime();
    const dateB = b.date instanceof Timestamp ? b.date.toDate().getTime() : new Date(b.date).getTime();
    return dateB - dateA;
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Relationship Timeline</h1>
        <p className="text-muted-foreground">
          Document and share special moments in your relationship
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-love hover:opacity-90 transition-opacity button-glow"
              onClick={() => {
                resetForm();
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Memory
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Memory" : "Add New Memory"}</DialogTitle>
              <DialogDescription>
                {editMode
                  ? "Update details of your special memory"
                  : "Document a special moment to add to your relationship timeline"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Our first date"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write about this special moment..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Paris, France"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="isPublic">
                    Make this memory public
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editMode ? "Update Memory" : "Add to Timeline"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No memories yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your relationship timeline by adding your special moments.
          </p>
          <Button
            onClick={() => setFormOpen(true)}
            className="bg-gradient-love hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Memory
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line with pulsing gradient effect */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-love-300 via-love-500 to-love-700 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-love-300 via-love-500 to-love-700 animate-pulse opacity-50"></div>
          </div>

          <div className="relative z-10 space-y-12">
            {sortedEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              const eventDate = event.date instanceof Timestamp ?
                event.date.toDate() : new Date(event.date);

              return (
                <div key={event.id} className="flex items-center justify-center">
                  {/* Connection line from center to card */}
                  <div className={cn(
                    "absolute left-1/2 w-14 h-0.5 bg-gradient-to-r",
                    isEven ?
                      "translate-x-0 from-love-500 to-transparent" :
                      "-translate-x-full from-transparent to-love-500"
                  )}></div>

                  {/* Card container */}
                  <div
                    className={cn(
                      "w-full md:w-4/12 p-1", // Reduced width from 5/12 to 4/12
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    )}
                  >
                    <Card className={cn(
                      "w-full transition-all duration-300 hover:scale-105 overflow-hidden",
                      "shadow-md hover:shadow-xl", // Added shadow effect
                      isEven ? "md:rounded-tr-2xl md:border-r-4 md:border-r-love-400" : "md:rounded-tl-2xl md:border-l-4 md:border-l-love-400",
                      event.isPublic ? "border-green-200 dark:border-green-800/40" : ""
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {event.isPublic ? (
                              <Unlock className="h-4 w-4 mr-2 text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            <CardTitle className="text-sm text-muted-foreground">
                              {event.isPublic ? "Public" : "Private"}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleTogglePublic(event)}
                            >
                              {event.isPublic ? (
                                <Lock className="h-4 w-4" />
                              ) : (
                                <Unlock className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(event)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-2">{event.title}</CardTitle>
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
                        <div className="px-4"> {/* Reduced padding */}
                          <div className="w-full h-40 rounded-md overflow-hidden"> {/* Reduced height */}
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      <CardContent className="text-sm"> {/* Reduced text size */}
                        <p className="whitespace-pre-wrap">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot with pulsing effect */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-love-500 border-4 border-background z-10 shadow-lg">
                    <span className="absolute inset-0 rounded-full bg-love-300 animate-ping opacity-75"></span>
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-love-300 to-love-600"></span>
                    <span className="relative flex items-center justify-center h-full w-full">
                      <Heart className="h-3 w-3 text-white" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this memory from your timeline.
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

export default RelationshipTimeline;